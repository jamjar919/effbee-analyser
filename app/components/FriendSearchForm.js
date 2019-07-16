import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react'

class FriendSearchForm extends Component<Props> {
    props: Props;

    constructor(props) {
        super(props);
        
        let friends = []
        if (typeof props.friendsApi.get() !== "undefined") {
            friends = props.friendsApi.get().map(f => ({ name: f.name, title: f.prettyName }))
        }

        this.state = {
            isSearchLoading: false,
            friends,
            searchResults: []
        }
    }

    render() {
        const {
            onResultSelect
        } = this.props;

        const {
            isSearchLoading,
            friends,
            searchResults
        } = this.state;

        return (
            <Search
                loading={isSearchLoading}
                onResultSelect={(e, { result }) => {
                    onResultSelect(result.name)
                }}
                onSearchChange={(e, { value }) => {
                    this.setState({ isSearchLoading: true }, () => {
                        const re = new RegExp(value, 'i')
                        this.setState({
                            searchResults: friends.filter(f => re.test(f.title)),
                            isSearchLoading: false
                        })
                    })
                }}
                results={searchResults}
            />
        )
    }
}

FriendSearchForm.propTypes = {
    friendsApi: PropTypes.object.isRequired,
    onResultSelect: PropTypes.func
}

FriendSearchForm.defaultProps = {
    onResultSelect: () => {}
}

function mapStateToProps(state) {
    return {
        friendsApi: state.facebook.friendsApi,
    };
}
  
  function mapDispatchToProps() {
    return {};
  }
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendSearchForm);
