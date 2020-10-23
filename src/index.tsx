import React, { ReactNode, useState, useRef, Ref, useImperativeHandle, forwardRef } from 'react';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent, View } from 'react-native';

export type SliderAPI = {
    next: () => void;
    prev: () => void;
};

export type Props = {
    children: ReactNode;
    width: number;
    height: number;
    onScroll?: (index: number) => void;
};

function SliderComponent(
    { children, width, height, onScroll = () => {} }: Props,
    ref: Ref<SliderAPI>
) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollView = useRef<ScrollView>(null);
    const items = React.Children.toArray(children);
    const totalItems = items.length;

    const scrollTo = (x: number) => {
        if (isScrolling) return;

        setIsScrolling(true);
        scrollView.current?.scrollTo({ x });
    };

    useImperativeHandle(ref, () => ({
        next: () => {
            scrollTo(width * 2);
        },
        prev: () => {
            scrollTo(0);
        },
    }));

    const onScrollStart = () => setIsScrolling(true);

    const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = event.nativeEvent.contentOffset.x / width;
        const direction = getDirection(index);

        if (direction === 'none') return;

        const newIndex = getNewIndex(currentIndex, totalItems, direction);

        setCurrentIndex(newIndex);
        scrollView.current?.scrollTo({ x: width, animated: false });
        setIsScrolling(false);

        onScroll(newIndex);
    };

    const itemsToRender = [
        items[getPrevIndex(currentIndex, totalItems)],
        items[currentIndex],
        items[getNextIndex(currentIndex, totalItems)],
    ];

    return (
        <View style={{ width, height }}>
            <ScrollView
                contentOffset={{ x: width, y: 0 }}
                pagingEnabled
                bounces={false}
                ref={scrollView}
                onMomentumScrollBegin={onScrollStart}
                onMomentumScrollEnd={onScrollEnd}
                horizontal
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
            >
                {itemsToRender.map((item, i) => (
                    <Slide key={i} width={width} height={height}>
                        {item}
                    </Slide>
                ))}
            </ScrollView>
        </View>
    );
}

type SlideProps = {
    width: number;
    height: number;
    children: ReactNode;
};

function Slide({ width, height, children }: SlideProps) {
    return (
        <View
            style={{
                width,
                height,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {children}
        </View>
    );
}

function getDirection(index: number): 'next' | 'prev' | 'none' {
    if (index > 1) return 'next';
    if (index < 1) return 'prev';
    return 'none';
}

function getNextIndex(currIndex: number, length: number): number {
    const maxIndex = length - 1;
    const nextIndex = currIndex + 1;

    if (nextIndex > maxIndex) return 0;

    return nextIndex;
}

function getPrevIndex(currentIndex: number, length: number) {
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) return length - 1;

    return prevIndex;
}

function getNewIndex(currentIndex: number, length: number, direction: 'next' | 'prev'): number {
    switch (direction) {
        case 'next':
            return getNextIndex(currentIndex, length);
        case 'prev':
            return getPrevIndex(currentIndex, length);
    }
}

export const Slider = forwardRef(SliderComponent);
