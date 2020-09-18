// @refresh reset

import { StatusBar } from "expo-status-bar";
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactNode,
  ReactChildren,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Button,
} from "react-native";

const sceenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function Slide({ color, children }: { color: string, children: ReactNode }) {
return <View style={{ justifyContent: 'center', alignItems: 'center', width: sceenWidth, height: screenHeight, backgroundColor: color }}>{children}</View>;
}

function getDirection(index: number): "next" | "prev" | "none" {
  if (index > 1) {
    return "next";
  }

  if (index < 1) {
    return "prev";
  }

  return "none";
}

function getNextIndex(currIndex: number, length: number): number {
  const maxIndex = length - 1;
  const nextIndex = currIndex + 1;

  if (nextIndex > maxIndex) {
    return 0;
  } else {
    return nextIndex;
  }
}

function getPrevIndex(currentIndex: number, length: number) {
  const prevIndex = currentIndex - 1;

  if (prevIndex < 0) {
    return length - 1;
  } else {
    return prevIndex;
  }
}

function getNewIndex(
  currentIndex: number,
  length: number,
  direction: "next" | "prev"
): number {
  switch (direction) {
    case "next":
      return getNextIndex(currentIndex, length);
    case "prev":
      return getPrevIndex(currentIndex, length);
  }
}

type Api = {
  next: () => void,
  prev: () => void
}

function SliderComponent({
  children,
  width,
  height,
  onScroll = () => {}
}: {
  children: ReactNode;
  width: number;
  height: number;
  onScroll?: (index: number) => void
}, ref: Ref<Api>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollView = useRef<ScrollView>(null);
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  useImperativeHandle(ref, () => ({
    next: () => {
      scrollView.current?.scrollToEnd()
    },
    prev: () => {
      scrollView.current?.scrollTo({x: 0})
    }
  }))

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = event.nativeEvent.contentOffset.x / width;
    const direction = getDirection(index);

    if (direction === "none") { return; }

    const newIndex = getNewIndex(currentIndex, totalItems, direction);

    setCurrentIndex(newIndex);
    scrollView.current?.scrollTo({ x: width * 1, animated: false });

    onScroll(newIndex)
  };

  const prevItem = items[getPrevIndex(currentIndex, totalItems)];
  const currItem = items[currentIndex];
  const nextItem = items[getNextIndex(currentIndex, totalItems)];

  const itemsToRender = [prevItem, currItem, nextItem];

  return (
    <View style={{ width, height }}>
      <ScrollView
        contentOffset={{x: width, y: 0}}
        pagingEnabled
        bounces={false}
        ref={scrollView}
        onMomentumScrollEnd={onScrollEnd}
        horizontal
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
      >
        {itemsToRender.map((item, i) => (
          <View
            key={i}
            style={{
              width,
              height,
              alignItems: "center",
              justifyContent: "center",
              overflow: 'hidden'
            }}
          >
            {item}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const Slider = forwardRef(SliderComponent);

export default function App() {

  const [index, setIndex] = useState(0);
  const slider = useRef<Api>(null);




  return (
    <View style={styles.container}>
      <Text>{index}</Text>
      <Slider ref={slider} onScroll={i => setIndex(i)} height={screenHeight-300} width={sceenWidth}>
        <Slide color="orange"><Text>1</Text></Slide>
        <Slide color="black"><Text style={{color: 'white'}}>2</Text></Slide>
        <Slide color="yellow"><Text>3</Text></Slide>
        <Slide color="grey"><Text>4</Text></Slide>
      </Slider>
      <View style={{flexDirection: 'row'}}>
        <Button title="prev" onPress={() => slider.current?.prev()}>prev</Button>
        <Button title="next" onPress={() => slider.current?.next()}>next</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
