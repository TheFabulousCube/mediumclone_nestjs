@users
@authentication
Feature: Register

  Background:
    * def testDataGenerator = Java.type('MediumClone.helpers.TestDataGenerator')
    * def username = testDataGenerator.getRandomUserName()
    * def email = testDataGenerator.getRandomEmail()
    * callonce read('classpath:MediumClone/schemas/UserResponse.feature')
    * url apiUrl

  Scenario: Register a new user
    Given path 'users'
    And request { user: {username:  '#(username)', email: '#(email)', password: '#(password)' }}
    When method Post
    Then status 201
    And match response == userResponse
    * def token = response.user.token
    * def user = response.user


    Given path 'users'
    And request { user: {username:  '#(username)', email: '#(email)', password: '#(password)' }}
    When method Post
    Then status 422
