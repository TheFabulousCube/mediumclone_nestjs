@users
@authentication
Feature: Existing user login

  Background:
    * url apiUrl
    * callonce read('classpath:MediumClone/schemas/UserResponse.feature')
    * print user1.username
    * print user1.email
    * print user1.token

  Scenario: Login for existing user
    Given path 'users', 'login'
    And request { user: {email: '#(user1.email)', password: '#(user1.password)' }}
    When method Post
    Then status 200
    And match response == userResponse

    Given path 'user'
    And header  Authorization = 'Bearer ' + user1.token
    When method Get
    Then status 200
    And match response == userResponse