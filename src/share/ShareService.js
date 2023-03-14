import { Share } from 'react-native';

/**
 * Share service
 */
class ShareService {

  /**
   * Invite
   * @param {string} referrer guid
   */
  invite(guid) {

    const url = 'https://www.minds.com/register?referrer=' + guid;
    const title = 'Join me on Minds.com';

    this.share(title, url);
  }

  /**
   * Share
   * @param {string} title
   * @param {string} url
   */
  share(title, url) {
    msg = {
      title: title,
      message: url,
    };

    opt = {
      subject: title,
      dialogTitle: title
    }

    Share.share(msg, opt);
  }
}

export default new ShareService();