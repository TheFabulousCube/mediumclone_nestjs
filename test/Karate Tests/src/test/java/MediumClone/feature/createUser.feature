@users
@authentication
Feature: Register

  Background:
    * def testDataGenerator = Java.type('mediumClone.helpers.TestDataGenerator')
    * def username = testDataGenerator.getRandomUserName()
    * def email = testDataGenerator.getRandomEmail()
    * callonce read('classpath:mediumClone/schemas/UserResponse.feature')
    * url apiUrl

  @newuser
  Scenario: Register a new user registers and logs in
    Given path 'users'
    And request { user: {username:  '#(username)', email: '#(email)', password: '#(password)' }}
    When method Post
    Then status 201
    And match response == userResponse
    * def token = response.user.token
    * def user = response.user

  @negative
  Scenario: Register an existing user fails
    Given path 'users'
    And request { user: {username:  '#(user.username)', email: '#(user.email)', password: '#(user.password)' }}
    When method Post
    Then status 422

  @negative
  Scenario: Get current user fails when not logged in
    Given path 'user'
    When method Get
    Then status 401

  @negative
  Scenario: Create new user missing username fails
    Given path 'users'
    And request { user: { username: null, email: 'random@email.com', password: 'randompassword'}}
    When method Post
    Then status 422
    And match response contains any { username: '#present' }

  @negative
  Scenario: Create new user missing email fails
    Given path 'users'
    And request { user: { username: 'randomUsername', email: null, password: 'randompassword'}}
    When method Post
    Then status 422
    And match response contains any { email: '#present' }

  @negative
  Scenario: Create new user poorly formed email fails
    Given path 'users'
    And request { user: { username: 'randomUsername', email: "badly.formed.email", password: 'randompassword'}}
    When method Post
    Then status 422
    And match response contains any { email: '#present' }

  @negative
  Scenario: Create new user missing password fails
    Given path 'users'
    And request { user: { username: 'randomUsername', email: 'random@email.com', password: null}}
    When method Post
    Then status 422
    And match response contains any { password: '#present' }