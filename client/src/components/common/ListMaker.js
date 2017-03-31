import React from 'react';

// see bottom for example usage using Semantic UI classNames

// TODO: fix linkedList to not be github URLs

class ListMaker extends React.Component {
  state = {
    item: '',
    items_list: [],
    error: ''
  }
  
  componentWillMount() {
    const items = this.props.prePopulateList;
    if (items.length > 0) {
      this.setState({ items_list: items });
    }
  }
  
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  
  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.addItem();
    }
  }
  
  handleChange = (e) => {
    this.setState({ item: e.target.value });
  }
  
  addItem = () => {
    this.setState({ error: '' });
    
    const { item, items_list } = this.state;
    const { saveListToParent, itemValidation, listType } = this.props;
    if(item === '') return;
    
    if (itemValidation && !itemValidation(item).isValid) {
      const { error } = itemValidation(item);
      this.setState({ error, item: '' });
    } else {
      items_list.push(item);
      this.setState({ items_list, item: '' });
      
      if (saveListToParent) {
        saveListToParent(listType, items_list);
      }
    }
  }
  
  removeItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list });
  
  }
  
  editItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list, item: item });
  }
  
  spliceList = (item) => {
    const { items_list } = this.state;
    const index = items_list.indexOf(item);
    items_list.splice(index, 1);
    return items_list;
  }
  
  render() {
    
    const { 
      linkedList, 
      showIcon, 
      iconType, 
      labelStyle, 
      placeholder, 
      label, 
      iconColor, 
      semanticStyle, 
      labelOnRight 
    } = this.props;
    
    const StandardItem = ({ item }) => {
      return <div className="content">{item}</div>
    }
    
    const LinkedItem = ({ item }) => {
      return <a href={`https://github.com/${item}`} className="content">{`https://github.com/${item}`}</a>
    }
    
    const listItems = this.state.items_list.map((item, index) => {
      return (
        <div key={index} className="item">
          <div className="right floated content">
            <a><i onClick={this.removeItem.bind(this, item)} className={"remove icon " + iconColor}/></a>
            <a><i onClick={this.editItem.bind(this, item)} className={"edit icon " + iconColor}/></a>
          </div>
          { linkedList ? <LinkedItem item={item} /> : <StandardItem item={item} /> }
        </div>
      );
    });
    
    const labelMarkup = (
      <a onClick={this.addItem} type="submit" className={'ui ' + labelStyle + ' label ' + iconColor}>
        {label}
      </a>
    );
    
    return (
      <div>
        <div className={semanticStyle}>
          { showIcon && <i className={iconType}/> }
          
          { !labelOnRight && labelMarkup }
          <input onChange={this.handleChange} value={this.state.item} type="text" placeholder={placeholder}/>
          { labelOnRight && labelMarkup }  
        
        </div>
        
        <div className="ui middle aligned divided list">
          {listItems}
        </div>
        
        { this.state.error.length > 0 && <div className="ui error message">{this.state.error}</div> }
      </div>
    );
  }
}

ListMaker.propTypes = {
  linkedList: React.PropTypes.bool,
  placeholder: React.PropTypes.string.isRequired, // placeholder text
  label: React.PropTypes.string.isRequired, // label text
  labelStyle: React.PropTypes.string, // defines label style (do not use if want standard lable style)
  labelOnRight: React.PropTypes.bool,
  showIcon: React.PropTypes.bool, // show icon 
  iconType: React.PropTypes.string, // defines icon type if showIcon set to true (any semantic icon)
  iconColor: React.PropTypes.string, // defines icon color if showIcon set to true (any semantic icon)
  listType: React.PropTypes.string, // for saveListToParent method
  semanticStyle: React.PropTypes.string, // semantic-ui label classname string, defines overall style (see semantic docs)
  saveListToParent: React.PropTypes.func, // see example below
  itemValidation: React.PropTypes.func, // see example below
  prePopulateList: React.PropTypes.array // pass in data from parent to pre-populate items saved in redux state
}

ListMaker.defaultProps = {
  semanticStyle: 'ui right labeled left icon input',
  labelOnRight: true,
  iconType: 'tag icon',
  showIcon: false,
  linkedList: false
}

export default ListMaker;

// EXAMPLE USAGE

// Below uses some default props defined above
// Will Render: https://snag.gy/43HrKq.jpg
// <ListMaker
//   placeholder="Enter Project"
//   labelStyle="tag"
//   label="Add Project"
//   saveListToParent={this.saveList}
//   listType="projects"
//   itemValidation={this.projectUrlValidation}
//   iconColor='teal'
//   showIcon={true}
// />
//
// Or, for more customization:
// Will render: https://snag.gy/NJloZQ.jpg
// <ListMaker
//   placeholder="Enter GitHub Repo"
//   label="https://github.com/"
//   saveListToParent={this.saveList}
//   listType="projects"
//   itemValidation={this.projectUrlValidation}
//   labelOnRight={false}
//   semanticStyle="ui labeled input"
// />  

// Functions:

// name ----------- type --- parameters

// itemValidation: {func}: ( item[string] ):
// takes item (value of input), expects object to be returned:
// itemValidation(item) => { isValid: Boolean, error: Object }
// EX:
// hadnleItemValidation = (item) => {
//   if (!Validator.isURL(item)) {
//     return {
//       isValid: false,
//       error: 'Item provided must be valid URL'
//     }
//   } else if (Validator.matches(item, /https?:\/\/github.com/i)) {
//     return {
//       isValid: false,
//       error: 'Expected github URL'
//     }
//   } else {
//     return {
//       isValid: true
//     }
//   }  
// }

// saveListToParent: {func}: ( listType[string], items_list[array] )
// called with listType which should correspond to state of parent
// and items_list, so that list can be saved in the right state
// EX:
// handleSaveListToParent = (type, list) => {
//   this.setState({ [type]: list });
// }