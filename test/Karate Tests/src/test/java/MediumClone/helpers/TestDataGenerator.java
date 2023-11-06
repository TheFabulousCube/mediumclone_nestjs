package mediumClone.helpers;

import com.github.javafaker.Faker;

public class TestDataGenerator {

    public static String getRandomUserName() {
        Faker faker = new Faker();
        String username = faker.name().username();
        return username;
    }

    public static String getRandomEmail() {
        Faker faker = new Faker();
        String email = faker.bothify("????###????###") + "@" + faker.ancient().hero() + "email.com";
        return email;
    }

    public static String getRandomPassword() {
        Faker faker = new Faker();
        String password = faker.bothify("????##????##");
        return password;
    }
    public static User getRandomUser() {
        Faker faker = new Faker();
        User user = new User();
        user.username = "why" + faker.name().username();
        user.email = user.username + "@email.com";
        user.password = faker.bothify("????##????##");
        return user;
    }

}
