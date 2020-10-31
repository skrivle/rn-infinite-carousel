# RN Infinite Carousel

## Installation

```
npm i rn-infinite-carousel --save
```

## Usage

```typescript
import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Slider } from 'rn-infinite-carousel';

function Slide({ text, color }) {
    return (
        <View style={{ ...styles.slide, backgroundColor: color }}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

export default function App() {
    return (
        <View style={styles.container}>
            <Slider width={styles.slide.width} height={styles.slide.height}>
                <Slide text="slide 1" color="black"></Slide>
                <Slide text="slide 2" color="green"></Slide>
                <Slide text="slide 3" color="blue"></Slide>
            </Slider>
        </View>
    );
}

const styles = StyleSheet.create({
    slide: {
        width: Dimensions.get('screen').width,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
```
