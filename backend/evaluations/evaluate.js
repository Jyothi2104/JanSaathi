const testCases = require("./testCases");
const { analyzeComplaint } = require("../gemini");

async function runEvaluation() {
    let correct = 0;

    console.log("Starting JanSaathi AI evaluation...\n");

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];

        try {
            const result = await analyzeComplaint(
                test.complaint,
                "English"
            );

            const predicted = result.category.toLowerCase();
            const expected = test.expectedCategory.toLowerCase();

            const isCorrect = predicted === expected;

            if (isCorrect) {
                correct++;
            }

            console.log(`Test ${i + 1}`);
            console.log(`Complaint: ${test.complaint}`);
            console.log(`Expected: ${expected}`);
            console.log(`Predicted: ${predicted}`);
            console.log(`Result: ${isCorrect ? "CORRECT" : "WRONG"}`);
            console.log("----------------------------------");

        } catch (error) {
            console.log(`Test ${i + 1} failed`);
            console.log(error.message);
            console.log("----------------------------------");
        }
    }

    const accuracy = (correct / testCases.length) * 100;

    console.log("\n==================================");
    console.log("JanSaathi AI Evaluation Complete");
    console.log("==================================");

    console.log(`Total Tests: ${testCases.length}`);
    console.log(`Correct Predictions: ${correct}`);
    console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
}

runEvaluation();