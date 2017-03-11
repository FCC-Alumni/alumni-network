import React from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';
import isEmpty from 'lodash/isEmpty';

export default function requireAuth(ComposedComponent) {

  class Authenticate extends React.Component {
    state = {
      redirect: false
    }
    componentWillMount() {
      if(!this.props.isVerified) {
        this.props.addFlashMessage({ 
          type: 'error',
          text: {
            header: 'Access forbiden!',
            message: 'Please signup and/or login to view this page.'
          }
        });
        this.props.history.push('/login');
        this.setState({ redirect: true });
      }
    }
    render() {
      return (
        <div>
          { this.state.redirect ? null : <ComposedComponent {...this.props} /> }
        </div>
      );
    }
  }
  
  Authenticate.propTypes = {
    isVerified: React.PropTypes.bool.isRequired,
    addFlashMessage: React.PropTypes.func.isRequired
  }
  
  function mapStateToProps(state) {
    if (isEmpty(state.user)) {
      return {
        isVerified: false
      }
    } else {
      return {
        isVerified: state.user.verifiedUser
      }
    }
  }
  
  return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}