@tags
Feature: Tags

  Background:
    * url apiUrl

  Scenario: Get all tags
    Given path 'tags'
    When method get
    Then status 200
    And match response == { "tags": '#[] #string'}


  