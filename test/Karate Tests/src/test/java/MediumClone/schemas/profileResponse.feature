Feature: Profile Response

  Scenario: Profile Response
    * def profileResponse =
    """
    {
      profile: {
        username: '#string',
        bio: '##string',
        image: '##string',
        following: '#boolean'
      }
    }
    """