@users
@authentication
Feature: Existing user login

  Background:
    * url apiUrl
    * callonce read('classpath:mediumClone/schemas/UserResponse.feature')
    * def newUser = call read('classpath:mediumClone/feature/createUser.feature@newuser')

  Scenario: Login for existing user
    Given path 'users', 'login'
    And request { user: {email: '#(newUser.email)', password: '#(password)' }}
    When method Post
    Then status 200
    And match response == userResponse

    Given path 'user'
    And header  Authorization = 'Bearer ' + newUser.token
    When method Get
    Then status 200
    And match response == userResponse

  @negative
  Scenario: Login fails with wrong password
    Given path 'users', 'login'
    And request { user: { email: '#(newUser.email)', password: "wrongpassword" }}
    When method Post
    Then status 403

  @negative
  Scenario: Login fails for non-existent user
    Given path 'users', 'login'
    And request { user: { email: "bademail@nowhere.com", password: '#(password)' }}
    When method Post
    Then status 403

