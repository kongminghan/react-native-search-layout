import React from 'react'
import {
  Dimensions,
  LayoutAnimation,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from '../../../src/components/Icon'

const Layout = {
  window: {
    width: Dimensions.get('window').width
  }
}
const SearchContainerHorizontalMargin = 10
const SearchContainerWidth =
  Layout.window.width - SearchContainerHorizontalMargin * 2

const SearchIcon = () => (
  <View style={styles.searchIconContainer}>
    <Icon name="search" size={18} color="#ccc" />
  </View>
)

class SearchBar extends React.PureComponent {
  state = {
    text: '',
    showCancelButton: false,
    inputWidth: SearchContainerWidth
  }

  _textInput: TextInput

  componentDidMount() {
    requestAnimationFrame(() => {
      this._textInput.focus()
    })
  }

  _handleLayoutCancelButton = (e: Object) => {
    if (this.state.showCancelButton) {
      return
    }

    const cancelButtonWidth = e.nativeEvent.layout.width

    requestAnimationFrame(() => {
      LayoutAnimation.configureNext({
        duration: 200,
        create: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.9,
          initialVelocity: 10
        }
      })

      this.setState({
        showCancelButton: true,
        inputWidth: SearchContainerWidth - cancelButtonWidth
      })
    })
  }

  render() {
    const { inputWidth, showCancelButton } = this.state
    const searchInputStyle = {}
    if (this.props.textColor) {
      searchInputStyle.color = this.props.textColor
    }

    return (
      <View style={styles.container}>
        <View style={[styles.searchContainer, { width: inputWidth }]}>
          <TextInput
            ref={view => {
              this._textInput = view
            }}
            clearButtonMode="while-editing"
            onChangeText={this._handleChangeText}
            value={this.state.text}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            placeholder="Search"
            placeholderTextColor={this.props.placeholderTextColor || '#ccc'}
            onSubmitEditing={this._handleSubmit}
            style={[styles.searchInput, searchInputStyle]}
          />

          <SearchIcon />
        </View>

        <View
          key={
            showCancelButton
              ? 'visible-cancel-button'
              : 'layout-only-cancel-button'
          }
          style={[
            styles.buttonContainer,
            { opacity: showCancelButton ? 1 : 0 }
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 20 }}
            onLayout={this._handleLayoutCancelButton}
            onPress={this._handlePressCancelButton}
          >
            <Text
              style={{
                fontSize: 17,
                color: this.props.tintColor || '#007AFF'
              }}
            >
              {this.props.cancelButtonText || 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _handleChangeText = text => {
    this.setState({ text })
    this.props.onChangeQuery && this.props.onChangeQuery(text)
  }

  _handleSubmit = () => {
    const { text } = this.state
    this.props.onSubmit && this.props.onSubmit(text)
    this._textInput.blur()
  }

  _handlePressCancelButton = () => {
    if (this.props.onCancelPress) {
      this.props.onCancelPress(this.props.navigation.goBack)
    } else {
      this.props.navigation.goBack()
    }
  }
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 2,
    paddingRight: 17
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 15,
    position: 'absolute',
    right: 0,
    top: 0
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  searchContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    height: 30,
    marginHorizontal: SearchContainerHorizontalMargin,
    marginTop: 10,
    paddingLeft: 27,
    width: SearchContainerWidth
  },
  searchIconContainer: {
    bottom: 0,
    left: 7,
    position: 'absolute',
    top: 6
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingTop: 1
  }
})

export default withNavigation(SearchBar)
