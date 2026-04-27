const API_URL = "http://localhost:3000/api/execute";

// A perfectly valid Java submission for your Allergies problem
const validSubmission = {
    slug: "allergies",
    action: "run",
    code: `
import java.util.ArrayList;
import java.util.List;

enum Allergen { EGGS(1), PEANUTS(2), SHELLFISH(4), STRAWBERRIES(8), TOMATOES(16), CHOCOLATE(32), POLLEN(64), CATS(128);
    private final int score;
    Allergen(int score) { this.score = score; }
    public int getScore() { return score; }
}

class Allergies {
    private final int score;
    public Allergies(int score) { this.score = score; }
    public boolean isAllergicTo(Allergen allergen) { return (this.score & allergen.getScore()) != 0; }
    public List<Allergen> getList() { return new ArrayList<>(); } // Fails tests, but compiles perfectly!
}`
};

async function fireBarrage(requestCount) {
    console.log(` Firing ${requestCount} simultaneous requests at the Express API...`);
    
    const startTime = Date.now();
    const promises = [];

    for (let i = 0; i < requestCount; i++) {
        // We do NOT await here. We want them all to fly out at the exact same time.
        const req = fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validSubmission)
        }).then(res => res.json())
          .then(data => console.log(`[EXPRESS] User ${i+1} got response: ${data.status} (Job ${data.jobId})`))
          .catch(err => console.log(`[EXPRESS] User ${i+1} Request Failed!`));
          
        promises.push(req);
    }

    await Promise.all(promises);
    const endTime = Date.now();
    
    console.log(`\n All ${requestCount} requests accepted by Express in ${endTime - startTime}ms!`);
    console.log(`Now watch your worker terminal slowly process them 2 at a time!`);
}

fireBarrage(10);