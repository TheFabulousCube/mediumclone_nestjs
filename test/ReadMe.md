# I've added Karate tests to my NestJs API!

<a href="https://www.karatelabs.io/" target="blank"><img src="../src/utils/karate-labs-logo-ring.svg" width="100" alt="Karate Logo" /></a>
Based on the PluralSight course [Karate Fundamentals](https://www.pluralsight.com/courses/karate-fundamentals). I enjoyed this course (and the Karate Test Framework) so much I wanted some more practice with it!

## I'm still working on the API, so I'm still working on the tests

Since I'm writing the tests against the RealWorld API specs, I can actually write the tests well ahead of the development! Running Karate against the live endpoint should work just fine. Pointing to my local will fail tests until the work is completed (_correctly!_).

For now, they can be ran manually. I'll look into automating the tests with GitHub Worflows.

### Helpful commands

I find IntelliJ easier for Karate than VSCode. Both have Karate plugins to help, but Karate Labs just moved being able to Run a single Scenario from the IDE to a paid subscription. Since it's built on Java, I feel IntelliJ handles that better. Eclipse should be similar. I still prefer to run the NestJs API in VSCode, so I ususally have both open and running.

I've also stuck with the Maven build, although I'm sure there _is_ a Gradle build. I just find Maven easier.

- Simple run command  
  `mvn clean test` (defaults to local)
- Pass in environment  
  `mvn clean test -Dkarate.env=local`
  `mvn clean test -Dkarate.env=live`

- Test results are generated in the /target folder  
  `test\Karate Tests\target\karate-reports\karate-summary.html`
