@Ignore
Feature: User Response

  Scenario: User Response
    * def userResponse =
    """
    {
      user: {
        email: "#regex .+[@].+[.].{2,3}",
        token: "#string",
        username: "#string",
        bio: "##string",
        image: "##string"
      }
    }
    """