// app/api/proof/route.ts
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Data parameter is required" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      const pythonProcess = spawn("python3", [
        "app/lib/proofs/proof_generator.py",
        data.toString(),
        5,
        JSON.stringify({
          poly_coeffs: [465390293, 145267510, 1547257383],
          folding_coeffs: [
            2397237051, 955425513, 2406997994, 670075056, 1973365045,
            2799307829, 1785299480, 3019626843, 2526429406, 522399455,
          ],
          challenges: [
            5217, 3617, 6787, 7526, 2887, 6982, 7848, 6029, 3282, 6803,
          ],
        }),
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

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ result: output }));
        } else {
          resolve(
            NextResponse.json(
              { error: `Python exited with code ${code}`, stderr: errorOutput },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// Keep GET method for backward compatibility (optional)
export async function GET() {
  return NextResponse.json(
    { error: "Use POST method with data parameter" },
    { status: 405 }
  );
}
