import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
    name: string
};

class FriendPreview extends React.Component<Props> {
    props: Props;
  
    render() {
      const { name } = this.props;
      return (
        <div>
          {name}
        </div>
      );
    }
  }
  
function mapStateToProps(state) {
    if (state.selection.type === 'FRIEND') {
        return { 
            name: state.selection.selection
        };
    }
    return {}
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendPreview);
