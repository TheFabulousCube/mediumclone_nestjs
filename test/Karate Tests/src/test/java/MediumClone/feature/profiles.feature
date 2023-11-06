@profiles
Feature: Profiles

  Background:
    * url apiUrl
    * callonce read('classpath:MediumClone/schemas/ProfileResponse.feature')
    * def user1 = call read('classpath:mediumClone/feature/createUser.feature@newuser')

  Scenario: Get a profile
    Given path 'profiles', user1.username
    When method Get
    Then status 200
    And match response == profileResponse


  @negative
  Scenario: Follow user when not logged in
    Given path 'profiles', "fakelogin", 'follow'
    When method Post
    Then status 401

  @negative
  Scenario: Follow user when not logged in
    Given path 'profiles', "fakelogin", 'follow'
    When method Delete
    Then status 401