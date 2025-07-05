// app/api/verify_proof/route.ts
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { existsSync } from "fs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Leggi il body come JSON
    const body = await request.json();
    const proofData = body.proof;

    if (!proofData) {
      return NextResponse.json(
        { error: "Proof data is required" },
        { status: 400 }
      );
    }

    return new Promise<NextResponse>(async (resolve) => {
      const tempFileName = `proof_${randomUUID()}.json`;
      const tempDir = join(process.cwd(), "tmp");
      const tempFilePath = join(tempDir, tempFileName);

      let fileCreated = false;
      let processCompleted = false;

      // Funzione per pulire il file temporaneo
      const cleanupTempFile = async () => {
        if (fileCreated && existsSync(tempFilePath)) {
          try {
            await unlink(tempFilePath);
            console.log(`Cleaned up temp file: ${tempFilePath}`);
          } catch (unlinkError) {
            console.error("Error deleting temp file:", unlinkError);
          }
        }
      };

      try {
        // Crea la directory tmp se non esiste
        if (!existsSync(tempDir)) {
          await mkdir(tempDir, { recursive: true });
        }

        // Scrivi il file temporaneo
        await writeFile(tempFilePath, JSON.stringify(proofData, null, 2));
        fileCreated = true;

        // Chiama lo script Python passando il path del file temporaneo
        const pythonProcess = spawn("python3", [
          "app/lib/proofs/proof_verifier.py",
          tempFilePath, // Passa il path del file invece del JSON
        ]);

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
          console.error(`stderr: ${data}`);
        });

        pythonProcess.on("close", async (code) => {
          if (processCompleted) return; // Evita doppia esecuzione
          processCompleted = true;

          await cleanupTempFile();

          console.log(`Python process exited with code: ${code}`);
          console.log(`Python stdout: ${output}`);
          console.log(`Python stderr: ${errorOutput}`);

          if (code === 0) {
            try {
              const result = JSON.parse(output);
              resolve(
                NextResponse.json({
                  success: true,
                  verification_result: result,
                  message: "Proof verification completed",
                })
              );
            } catch (parseError) {
              // Se non è JSON valido, restituisci come stringa
              resolve(
                NextResponse.json({
                  success: true,
                  verification_result: output.trim(),
                  message: "Proof verification completed",
                })
              );
            }
          } else {
            resolve(
              NextResponse.json(
                {
                  success: false,
                  error: `Verification failed with code ${code}`,
                  stderr: errorOutput || "No error message provided",
                  stdout: output || "No output provided",
                  message: "Proof verification failed",
                  debug: {
                    pythonScript: "app/lib/proofs/proof_verifier.py",
                    tempFilePath: tempFilePath,
                    fileExists: existsSync(tempFilePath),
                  },
                },
                { status: 500 }
              )
            );
          }
        });

        // Timeout per evitare processi che rimangono appesi
        setTimeout(async () => {
          if (processCompleted) return;
          processCompleted = true;

          pythonProcess.kill();
          await cleanupTempFile();

          resolve(
            NextResponse.json(
              {
                success: false,
                error: "Verification timeout",
                message: "Proof verification timed out",
              },
              { status: 408 }
            )
          );
        }, 30000);
      } catch (fileError) {
        console.error("Error creating temp file:", fileError);
        await cleanupTempFile();
        resolve(
          NextResponse.json(
            {
              success: false,
              error: "Failed to create temporary file",
              message: "Internal server error",
            },
            { status: 500 }
          )
        );
      }
    });
  } catch (error) {
    console.error("Error in verify_proof API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body or JSON format",
        message: "Failed to parse proof data",
      },
      { status: 400 }
    );
  }
}
