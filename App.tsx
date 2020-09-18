// @refresh reset

import { StatusBar } from "expo-status-bar";
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactNode,
  ReactChildren,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
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

function Slider({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollView = useRef<ScrollView>(null);
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  useLayoutEffect(() => {
    setTimeout(() => {
      scrollView.current?.scrollTo({ x: width * 1, animated: false });
    });
  }, []);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = event.nativeEvent.contentOffset.x / width;
    const direction = getDirection(index);

    if (direction === "none") { return; }

    const newIndex = getNewIndex(currentIndex, totalItems, direction);

    setCurrentIndex(newIndex);
    scrollView.current?.scrollTo({ x: width * 1, animated: false });
  };

  const prevItem = items[getPrevIndex(currentIndex, totalItems)];
  const currItem = items[currentIndex];
  const nextItem = items[getNextIndex(currentIndex, totalItems)];

  const itemsToRender = [prevItem, currItem, nextItem];

  return (
    <View style={{ width, height }}>
      <ScrollView
        pagingEnabled
        bounces={false}
        ref={scrollView}
        onMomentumScrollEnd={onScrollEnd}
        horizontal
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
      >
        {itemsToRender.map((item) => (
          <View
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

export default function App() {
  return (
    <View style={styles.container}>
      <Slider height={screenHeight-300} width={sceenWidth}>
        <Slide color="orange"><Text>1</Text></Slide>
        <Slide color="black"><Text style={{color: 'white'}}>2</Text></Slide>
        <Slide color="yellow"><Text>3</Text></Slide>
      </Slider>
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
