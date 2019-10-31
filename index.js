drawerOffsetimport React from "react"
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity
} from "react-native"
import PropTypes from "prop-types"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height
const isIOS = Platform.OS === "ios"
const VERSION = parseInt(Platform.Version, 10)

class MenuDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.drawerOffset = new Animated.Value(0)
    this.state = {
      expanded: false,
      fadeAnim: new Animated.Value(1)
    }
  }

  openDrawer = () => {
    const { drawerPercentage, animationTime, opacity } = this.props
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100)

    Animated.parallel([
      Animated.timing(this.drawerOffset, {
        toValue: DRAWER_WIDTH,
        duration: animationTime,
        useNativeDriver: true
      }),
      Animated.timing(this.state.fadeAnim, {
        toValue: opacity,
        duration: animationTime,
        useNativeDriver: true
      })
    ]).start()
  }

  closeDrawer = () => {
    const { animationTime } = this.props

    Animated.parallel([
      Animated.timing(this.drawerOffset, {
        toValue: 0,
        duration: animationTime,
        useNativeDriver: true
      }),
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: animationTime,
        useNativeDriver: true
      })
    ]).start()
  }

  drawerFallback = () => {
    return (
      <TouchableOpacity onPress={this.closeDrawer}>
        <Text>Close</Text>
      </TouchableOpacity>
    )
  }

  componentDidUpdate() {
    const { open } = this.props

    open ? this.openDrawer() : this.closeDrawer()
  }

  renderPush = () => {
    const { children, drawerContent, drawerPercentage, direction, open } = this.props
    const { fadeAnim } = this.state
    const animated = { transform: [{ translateX: this.drawerOffset }] }
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100)
    const left = direction !== 'right';

    if (isIOS && VERSION >= 11) {
      return (
        <Animated.View style={[animated, styles.main, left ? styles.left : styles.right]}>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={[
                styles.drawer,
                {
                  width: DRAWER_WIDTH,
                  left: -DRAWER_WIDTH
                }
              ]}
            >
              {drawerContent ? drawerContent : this.drawerFallback()}
            </View>
            <Animated.View
              style={[
                styles.container,
                left ? styles.left : styles.right,
                {
                  opacity: fadeAnim
                }
              ]}
            >
              <TouchableOpacity disabled={!open}>
                {children}
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        </Animated.View>
      )
    }

    return (
      <Animated.View style={[animated, styles.main, left ? styles.left : styles.right, { width: SCREEN_WIDTH + DRAWER_WIDTH }]}>
        <View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              left: -DRAWER_WIDTH
            }
          ]}
        >
          {drawerContent ? drawerContent : this.drawerFallback()}
        </View>
        <Animated.View
          style={[
            styles.container,
            left ? styles.left : styles.right,
            {
              opacity: fadeAnim
            }
          ]}
        >
          <TouchableOpacity disabled={!open}>
            {children}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    )
  }

  renderOverlay = () => {
    const { children, drawerContent, drawerPercentage, direction } = this.props
    const { fadeAnim } = this.state
    const animated = { transform: [{ translateX: this.drawerOffset }] }
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100)
    const left = direction !== 'right';

    if (isIOS && VERSION >= 11) {
      return (
        <SafeAreaView style={[styles.main, left ? styles.left : styles.right]}>
          <Animated.View
            style={[animated, styles.drawer, { width: DRAWER_WIDTH }, left ? { left: -DRAWER_WIDTH } : { right: -DRAWER_WIDTH }]}
          >
            {drawerContent ? drawerContent : this.drawerFallback()}
          </Animated.View>
          <Animated.View style={[styles.container, left ? styles.left : styles.right, { opacity: fadeAnim }]}>

            {children}
          </Animated.View>
        </SafeAreaView>
      )
    }

    return (
      <View style={[styles.main, left ? styles.left : styles.right]}>
        <Animated.View
          style={[
            animated,
            styles.drawer,
            {
              width: DRAWER_WIDTH
            },
            left ? { left: -DRAWER_WIDTH } : { right: -DRAWER_WIDTH }
          ]}
        >
          {drawerContent ? drawerContent : this.drawerFallback()}
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            left ? styles.left : styles.right,
            {
              opacity: fadeAnim
            }
          ]}
        >
          {children}
        </Animated.View>
      </View>
    )
  }

  render() {
    const { overlay } = this.props

    return overlay ? this.renderOverlay() : this.renderPush()
  }
}

MenuDrawer.defaultProps = {
  open: false,
  drawerPercentage: 45,
  animationTime: 200,
  overlay: true,
  opacity: 0.4
}

MenuDrawer.propTypes = {
  open: PropTypes.bool,
  drawerPercentage: PropTypes.number,
  animationTime: PropTypes.number,
  overlay: PropTypes.bool,
  opacity: PropTypes.number
}

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    top: 5
  },
  left: {
    left: 0,
  },
  right: {
    right: 0
  },
  container: {
    position: "absolute",
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 0
  },
  drawer: {
    position: "absolute",
    height: SCREEN_HEIGHT,
    zIndex: 1
  }
})

export default MenuDrawer
