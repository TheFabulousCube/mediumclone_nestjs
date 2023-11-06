@users
@authentication
Feature: Users

  Background:
    * url apiUrl
    * callonce read('classpath:mediumClone/schemas/UserResponse.feature')
    * def newUser = call read('classpath:mediumClone/feature/createUser.feature@newuser')

  Scenario: Get current user gets logged in user
    Given path 'user'
    And header  Authorization = 'Bearer ' + newUser.token
    When method Get
    Then status 200
    And match response == userResponse

  @negative
  Scenario: Get current user fails if not logged in
    Given path 'user'
    And header  Authorization = null
    When method Get
    Then status 401


