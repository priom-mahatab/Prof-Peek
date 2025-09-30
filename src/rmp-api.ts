import { RateMyProfessor } from "rate-my-professor-api-ts";
(async function main() {
    const rmp_instance = new RateMyProfessor("St. Edward's University", "Megan Avery");

    console.log(await rmp_instance.get_professor_info());
})();