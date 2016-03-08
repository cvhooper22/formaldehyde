import React from 'react';
import _ from 'lodash';

export default class TagsInput extends React.Component {
  static propTypes = {
    autocompleteList: React.PropTypes.array,
    textKey: React.PropTypes.string,
    valueKey: React.PropTypes.string,
    className: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
    requireAutocompleteMatch: React.PropTypes.bool,
    valueSeperator: React.PropTypes.string,
    label: React.PropTypes.string,
    getTagValidationError: React.PropTypes.func,
    validateAllTags: React.PropTypes.func,
    transformTag: React.PropTypes.func,
    minimumCount: React.PropTypes.number,
    maximumCount: React.PropTypes.number,
    emptyText: React.PropTypes.string,
    id: React.PropTypes.string,
  };

  static contextTypes = {
    getFormModelValue: React.PropTypes.func.isRequired,
    registerFormInput: React.PropTypes.func.isRequired,
    unregisterFormInput: React.PropTypes.func.isRequired,
  };

  constructor (props, context) {
    super(props, context);
    if (props.autocompleteList) {
      this.buildAutcompleteListHash(props.autocompleteList);
    }
    this.state = {};
    this.onKeyPress = ::this.onKeyPress;
    this.onKeyUp = ::this.onKeyUp;
    this.onBlur = ::this.onBlur;
    this.onFocus = ::this.onFocus;
    this.onChange = ::this.onChange;
  }

  componentDidMount () {
    this.context.registerFormInput(this);
  }

  componentWillReceiveProps (props) {
    if (props.autocompleteList !== this.props.autocompleteList) {
      this.buildAutcompleteListHash(props.autocompleteList);
    }
  }

  componentWillUnmount () {
    if (this.onBlurTimeout) {
      window.clearTimeout(this.onBlurTimeout);
      delete this.onBlurTimeout;
    }
    this.context.unregisterFormInput(this);
  }

  buildAutcompleteListHash (list = []) {
    this.autocompleteListHash = {};
    (list || []).map((item) => {
      const key = item[this.props.valueKey];
      this.autocompleteListHash[key] = item;
    });
  }

  onTagRemove (tag) {
    const currentTags = _.clone(this.getArrayValue());
    const index = currentTags.indexOf(tag);
    currentTags.splice(index, 1);
    this.setState({
      value: currentTags,
    });
  }

  onFocus () {
    if (this.onBlurTimeout) {
      window.clearTimeout(this.onBlurTimeout);
      delete this.onBlurTimeout;
    }
  }

  onBlur () {
    this.onBlurTimeout = window.setTimeout(() => {
      this.setState({
        highlightIndex: -1,
        filteredAutocompleteList: [],
        lastSearch: '',
      });
    }, 100); // blur might happen
  }

  onKeyPress (evt) {
    if (evt.which === 13) {
      evt.preventDefault();
      this.processEnter(evt.target.value);
    }
  }

  onKeyUp (evt) {
    if (evt.which === 38 && this.state.filteredAutocompleteList && this.state.filteredAutocompleteList.length) {
      let index = this.state.highlightIndex - 1;
      if (index <= -1) {
        index = this.state.filteredAutocompleteList.length - 1;
      }
      this.setState({
        highlightIndex: index,
      });
    } else if (evt.which === 40 && this.state.filteredAutocompleteList && this.state.filteredAutocompleteList.length) {
      // down
      let index = this.state.highlightIndex + 1;
      if (index >= this.state.filteredAutocompleteList.length) {
        index = 0;
      }
      this.setState({
        highlightIndex: index,
      });
    } else if (evt.which !== 13 && this.props.autocompleteList) {
      this.processAutocomplete(evt.target.value);
    }
  }

  onChange (evt) {
    if (this.state && this.state.currentTagValidationError) {
      this.setState({
        currentTagValidationError: undefined,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(evt);
    }
  }

  onAutocompleteListSelect (option) {
    this.addTag(option[this.props.valueKey]);
    this.refs.searchInput.focus();
  }

  getModelValue (props = this.props, context = this.context) {
    const value = context.getFormModelValue(props.name);
    if (this.props.valueSeperator) {
      if (value) {
        return (value || '').split(this.props.valueSeperator);
      } else {
        return [];
      }
    } else {
      return value || [];
    }
  }

  getId () {
    if (!this._id) {
      this._id = _.uniqueId('tags-input__input');
    }
    return this._id;
  }

  getArrayValue () {
    if (this.state.hasOwnProperty('value')) { // has it been set?
      return this.state.value;
    } else {
      return this.getModelValue();
    }
  }

  getValue () {
    const value = this.getArrayValue();
    if (this.props.valueSeperator) {
      return value.join(this.props.valueSeperator);
    }
    return value;
  }

  getValidationError () {
    if (this.props.hasOwnProperty('minimumCount')) {
      if (this.getArrayValue().length < this.props.minimumCount) {
        return `Minumum tags (${this.props.minimumCount}) required were not met.`;
      }
    }
    if (this.props.hasOwnProperty('maximumCount')) {
      if (this.getArrayValue().length > this.props.maximumCount) {
        return `Exceeded the maximum tags (${this.props.maximumCount}) allowed.`;
      }
    }
    if (this.props.validateAllTags && !this.props.validateAllTags(this.getArrayValue())) {
      return 'Some of your tags are invalid.';
    }
    return undefined;
  }

  getTagValidationError (tag, tags) {
    if (tags.indexOf(tag) !== -1) {
      return 'This tag already exists in the list.';
    }

    if (this.props.getTagValidationError) {
      return this.props.getTagValidationError(tag, tags);
    }

    return undefined;
  }

  render () {
    return (
      <div className={ `tags-input ${this.props.className || ''}` }>
        { this.renderLabel() }
        <ul className="tags-input__list">
          { this.renderList() }
        </ul>
        <div className="tags-input__all">
          { this.renderErrorMessage() }
          <input id={ this.props.id } placeholder={ this.props.placeholder } autoComplete="off" type="search" id={ this.getId() } onKeyPress={ this.onKeyPress } onKeyUp={ this.onKeyUp } onFocus={ this.onFocus } onBlur={ this.onBlur } onChange={ this.onChange } ref="searchInput" />
          { this.renderAutocompleteList() }
        </div>
      </div>
    );
  }

  renderErrorMessage () {
    if (this.state.currentTagValidationError) {
      return <div className="tags-input__error">{ this.state.currentTagValidationError }</div>;
    }
  }

  renderLabel () {
    if (this.props.label) {
      return (
        <label className="tags-input__label" htmlFor={ this.getId() }>
          { this.props.label }
        </label>
      );
    }
  }

  renderList () {
    const list = this.getArrayValue();
    if (list && list.length) {
      return list.map((value) => {
        let text = value;
        if (this.autocompleteListHash) {
          const found = this.autocompleteListHash[value] || {};
          text = found[this.props.textKey] || text;
        }
        return (
          <li className="tag" key={ value }>
            { text }
            <div className="tag__close-icon">
              <i className="icon icon--close icon--clickable" onClick={ this.onTagRemove.bind(this, value) } />
            </div>
          </li>
        );
      });
    } else if (this.props.emptyText) {
      return <em className="tags-input__empty-text">{ this.props.emptyText }</em>;
    }
  }

  renderAutocompleteList () {
    if (this.state.filteredAutocompleteList && this.state.filteredAutocompleteList.length) {
      const list = this.state.filteredAutocompleteList.map((item, i) => {
        let className = 'tags-input__autocomplete__item';
        if (i === this.state.highlightIndex) {
          className += ` ${className}--highlight`;
        }
        return (
          <li key={ item[this.props.valueKey] } className={ className || '' } onClick={ this.onAutocompleteListSelect.bind(this, item) }>{ item[this.props.textKey] }</li>
        );
      });
      return <ul className="tags-input__autocomplete">{ list }</ul>;
    }
  }

  addTag (tag) {
    // tag is the ID
    const tags = this.getArrayValue();
    const validationError = this.getTagValidationError(tag, tags);
    if (validationError) {
      this.setState({
        currentTagValidationError: validationError,
      });
      return false;
    }
    let tagsToAdd = tag;
    if (this.props.transformTag) {
      tagsToAdd = this.props.transformTag(tagsToAdd);
    }
    if (!_.isArray(tagsToAdd)) {
      tagsToAdd = [tagsToAdd];
    }
    tagsToAdd = tagsToAdd.filter((tagCheck) => {
      return tags.indexOf(tagCheck) === -1;
    });
    if (tagsToAdd.length) {
      this.setState({
        currentTagValidationError: undefined,
        value: tags.concat(tagsToAdd),
        filteredAutocompleteList: [],
        lastSearch: '',
        highlightIndex: -1,
      });
      if (this.refs.searchInput) {
        this.refs.searchInput.value = '';
      }
    }
    return false;
  }

  processEnter (value) {
    if (this.state.highlightIndex > -1) {
      const tag = this.state.filteredAutocompleteList[this.state.highlightIndex];
      this.addTag(tag[this.props.valueKey]);
    } else {
      if (this.props.requireAutocompleteMatch) {
        const lower = value.toLowerCase();
        const found = this.props.autocompleteList.find((place) => {
          return place[this.props.textKey].toLowerCase() === lower;
        });
        if (found) {
          this.addTag(found[this.props.valueKey]);
        }
      } else {
        this.addTag(value);
      }
    }
  }

  processAutocomplete (value) {
    if (value.length > 0) {
      if (this.state.lastSearch !== value) {
        const lower = value.toLowerCase();
        const filteredAutocompleteList = this.props.autocompleteList.filter((place) => {
          return place[this.props.textKey].toLowerCase().indexOf(lower) !== -1 && this.getArrayValue().indexOf(place[this.props.valueKey]) === -1;
        }).slice(0, 10);

        this.setState({
          currentTagValidationError: undefined,
          filteredAutocompleteList,
          lastSearch: value,
          highlightIndex: -1,
        });
      }
    } else if (this.state.filteredAutocompleteList && this.state.filteredAutocompleteList.length) {
      this.setState({
        currentTagValidationError: undefined,
        filteredAutocompleteList: [],
        lastSearch: '',
        highlightIndex: -1,
      });
    }
  }
}
