import { ReactElement, createElement, useState, useRef, useCallback, useEffect } from "react";
import { Dimensions, FlatList, Pressable, SafeAreaView, StatusBar, TextStyle, View, ViewStyle } from "react-native";
import { ObjectItem, ListValue } from "mendix";
import { mergeNativeStyles, Style } from "@mendix/pluggable-widgets-tools";
import { NativeAdvancedListViewProps } from "../typings/NativeAdvancedListViewProps";
import { Icon } from "mendix/components/native/Icon";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
    scrollToBottomBtn: ViewStyle;
    scrollToTopBtn: ViewStyle;
}

export interface StyleProps {
    scrollToBottomButtonPositionY: any;
    scrollToBottomButtonColor: any;
}

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export function NativeAdvancedListView({
    style,
    data,
    content,
    isInverted,
    scrollToBtn,
    iconScrollToBottom,
    iconScrollToTop,
    enablePagination,
    pageSize,
    pageEndAction
}: NativeAdvancedListViewProps<CustomStyle>): ReactElement {
    if (data === undefined || data.status != "available") {
        return <View />;
    }

    const [recordCount, setRecordCount] = useState(0);
    const [runCount, setRunCount] = useState<number>(1);
    const [yScroll, setYScroll] = useState<number>(0);
    const [itemCount, setItemCount] = useState(0);
    const mergedStyles = mergeNativeStyles(defaultStyle, style);
    let flatListRef = useRef();

    // Function to run on first load
    useEffect(() => {
        setRecordCount(pageSize);
        setRunCount(runCount + 1);
        if(data.items){
            setItemCount(data.items?.length - 1);   
        }
    }, [data]);

    // Function to get the data
    const getData = useCallback(
        count => {
            if (data.items != undefined) {
                data.setLimit(count);
                // setItemCount(data.items?.length - 1);
                return data.items;
            }
        },
        [data, runCount]
    );

    const getDataFull = (data: ListValue) => {
        if (data.items != undefined) {
            // setItemCount(data.items?.length - 1);
            return data.items;
        }
    };

    // Function to trigger getting next set of data
    const onPageEndReached = () => {
        if (enablePagination) { //not working
            setRecordCount(runCount * pageSize);
            setRunCount(runCount + 1);
        }
        if (pageEndAction?.canExecute) {
            pageEndAction.execute();
        }
    };

    // Function to render the button to scroll to the latest message
    const renderScrollToBottomButton = () => {
        if (scrollToBtn === "none" || scrollToBtn === "top") {
            return <View />;
        }

        if (yScroll != 0) {
            return (
                <Pressable
                    style={mergedStyles.scrollToBottomBtn}
                    onPress={() => {
                        if (flatListRef.current != undefined) {
                            // @ts-ignore
                            flatListRef.current.scrollToIndex({
                                animated: true,
                                index: isInverted ? 0 : itemCount
                            });
                        }
                    }}
                >
                    <Icon icon={iconScrollToBottom.value} size={12} />
                </Pressable>
            );
        } else {
            return null;
        }
    };

    // Function to render the button to scroll to the latest message
    const renderScrollToTopButton = () => {
        if (scrollToBtn === "none" || scrollToBtn === "bottom") {
            return <View />;
        }
        if (yScroll > 0) {
            return (
                <Pressable
                    style={mergedStyles.scrollToTopBtn}
                    onPress={() => {
                        if (flatListRef.current != undefined) {
                            // @ts-ignore
                            flatListRef.current.scrollToIndex({
                                animated: true,
                                index: isInverted ? itemCount : 0 
                            });
                        }
                    }}
                >
                    <Icon icon={iconScrollToTop.value} size={12} />
                </Pressable>
            );
        } else {
            return null;
        }
    };

    // Function to render list items
    const renderItem = useCallback(({ item, index }: { item: ObjectItem; index: number }) => {
        return (
            <View key={index} testID={`$content$${index}`} accessible>
                {content?.get(item)}
            </View>
        );
    }, []);

    // Function to capture messages scrolling
    const onFLScroll = (r: { nativeEvent: { contentOffset: { y: any } } }) => {
        setYScroll(r.nativeEvent.contentOffset.y);
    };

    // Function to capture size of the listview
    const onLayout = (event: { nativeEvent: { layout: { y: any; height: any } } }) => {
        const { y, height } = event.nativeEvent.layout;
        const heightCalc = y + height - 50;
        mergedStyles.scrollToBottomBtn.top = heightCalc;
    };

    return (
        <SafeAreaView style={mergedStyles.container}>
            <FlatList
                // @ts-ignore
                ref={flatListRef}
                data={enablePagination ? getData(recordCount) : getDataFull(data)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                inverted={isInverted}
                onEndReachedThreshold={0}
                onEndReached={onPageEndReached}
                persistentScrollbar={true}
                onScroll={onFLScroll}
                onLayout={onLayout}
            />
            {renderScrollToTopButton()}
            {renderScrollToBottomButton()}
        </SafeAreaView>
    );
}

export const defaultStyle: CustomStyle = {
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0
    },
    scrollToBottomBtn: {
        position: "absolute",
        top: windowHeight - 400,
        right: 10,
        backgroundColor: "#000000",
        borderRadius: 20,
        width: 30,
        height: 30,
        alignItems: "center"
    },
    scrollToTopBtn: {
        position: "absolute",
        top: 100,
        right: 10,
        backgroundColor: "#cccccc",
        borderRadius: 20,
        width: 30,
        height: 30,
        alignItems: "center"
    },
    // btnGlyph: {
    //     height: 20,
    //     width: 20,
    //     marginTop: 5,
    //     resizeMode: "contain"
    // },
    label: {
        color: "#000"
    }
};
