import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('mobx-react/native', () => require('mobx-react/custom'));
jest.useFakeTimers();
