export const error_messages = {
  PASSWORD_FAILURE: 'Your password is invalid',
  UNAUTHORIZED_REQUEST: 'Please log in to continue',
  MALFORMED_EMAIL: 'Your email must be a valid email',
  ARTICLE_NOT_FOUND: 'Article is not found',
  ARTICLE_DELETE: 'Only the Author may delete an article',
  ARTICLE_UPDATE: 'Only the Author may update an article',
  USER_UNAUTHORIZED: 'User failed validation',
  USER_CONFLICT: 'Either the username or the email is already taken',
  USER_NOT_FOUND: 'No one by that email is available',
  PROFILE_NOT_FOUND(username: string): string {
    return `Profile ${username} does not exist`;
  },
  PROFILE_ALREADY_FOLLOWING(loggedInUser: string, profile: string): string {
    return `user ${loggedInUser} is already following ${profile}`;
  },
  PROFILE_NOT_FOLLOWING(loggedInUser: string, profile: string): string {
    return `user ${loggedInUser} isn't following ${profile}`;
  },
};
