// @refresh reset
import React, { useState, useRef, ReactNode } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import { SliderAPI, Slider } from "./Slider";

const sceenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function Slide({ color, children }: { color: string; children: ReactNode }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: sceenWidth,
        height: screenHeight,
        backgroundColor: color,
      }}
    >
      {children}
    </View>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const slider = useRef<SliderAPI>(null);

  return (
    <View style={styles.container}>
      <Text>{index}</Text>
      <Slider
        ref={slider}
        onScroll={(i) => setIndex(i)}
        height={screenHeight - 300}
        width={sceenWidth}
      >
        <Slide color="orange">
          <Text>1</Text>
        </Slide>
        <Slide color="black">
          <Text style={{ color: "white" }}>2</Text>
        </Slide>
        <Slide color="yellow">
          <Text>3</Text>
        </Slide>
        <Slide color="grey">
          <Text>4</Text>
        </Slide>
      </Slider>
      <View style={{ flexDirection: "row" }}>
        <Button title="prev" onPress={() => slider.current?.prev()}>
          prev
        </Button>
        <Button title="next" onPress={() => slider.current?.next()}>
          next
        </Button>
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
