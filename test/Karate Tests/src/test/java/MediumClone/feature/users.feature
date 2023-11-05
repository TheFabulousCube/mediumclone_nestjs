@users
@authentication
Feature: Users

  Background:
    * url apiUrl

    @negative
  Scenario: Get current user fails when not logged in
    Given path 'user'
    When method Get
    Then status 401

    @negative
  Scenario: Create new user missing fields fails
    Given path 'users'
    And request { user: { username: null, email: 'random@email.com', password: 'randompassword'}}
    When method Post
    Then status 422
    And match response contains any { username: '#present' }

    Given path 'users'
    And request { user: { username: 'randomUsername', email: null, password: 'randompassword'}}
    When method Post
    Then status 422
      And match response contains any { email: '#present' }

    Given path 'users'
    And request { user: { username: 'randomUsername', email: 'random@email.com', password: null}}
    When method Post
    Then status 422
      And match response contains any { password: '#present' }
