import React from 'react';

// see bottom for example usage using Semantic UI classNames

class ListMaker extends React.Component {
  state = {
    item: '',
    items_list: []
  }
  
  handleChange = (e) => {
    this.setState({ item: e.target.value });
  }
  
  addItem = (e) => {
    e.preventDefault();
    const { item, items_list } = this.state;
    const { saveListToParent } = this.props;
    if(item === '') return;
    
    items_list.push(item);
    this.setState({ items_list, item: '' });
    if (saveListToParent) {
      saveListToParent(items_list);
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
    
    const { icon, labelStyle, placeholder, label, iconColor } = this.props;
    
    const list = this.state.items_list.map((item, index) => {
      return (
        <div key={index} className="item">
          <div className="right floated content">
            <a><i onClick={this.removeItem.bind(this, item)} className={"remove icon " + iconColor}/></a>
            <a><i onClick={this.editItem.bind(this, item)} className={"edit icon " + iconColor}/></a>
          </div>
          <div className="content">{item}</div>
        </div>
      );
    });
    
    return (
      <form onSubmit={this.addItem}>
        <div className="ui right labeled left icon input">
          <i className={icon}/>
          <input onChange={this.handleChange} value={this.state.item} type="text" placeholder={placeholder}/>
          <a onClick={this.addItem} type="submit" className={labelStyle + ' ' + iconColor}>
            {label}
          </a>
        </div>
        
        <div className="ui middle aligned divided list">
          {list}
        </div>
      </form>
    );
  }
}

ListMaker.propTypes = {
  label: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  saveListToParent: React.PropTypes.func
}

export default ListMaker;

// EXAMPLE USAGE:
// <ListMaker
//   placeholder="Enter Skill"
//   labelStyle="ui tag label"
//   label="Add Skill"
//   icon="tag icon"
//   iconColor="red"
// />