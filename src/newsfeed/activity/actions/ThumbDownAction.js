import ThumbUpAction from './ThumbUpAction';

/**
 * Thumb Down Action Component
 */
export default class ThumbDownAction extends ThumbUpAction {
  direction = 'down';
  iconName = 'thumb-down';

  get voted() {
    return this.props.entity.votedDown;
  }
}
