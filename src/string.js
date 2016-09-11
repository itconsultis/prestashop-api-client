import inflector from 'i';
const inflect = inflector();

const string = {};

export default string;

string.snake = (...args) => inflect.underscore(...args);
string.studly = (...args) => inflect.camelize(...args);
