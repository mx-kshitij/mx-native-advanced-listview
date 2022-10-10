/**
 * This file was generated from NativeAdvancedListView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties } from "react";
import { ActionValue, DynamicValue, ListValue, NativeIcon, ListWidgetValue } from "mendix";

export type ScrollToBtnEnum = "none" | "top" | "bottom" | "both";

export interface NativeAdvancedListViewProps<Style> {
    name: string;
    style: Style[];
    data: ListValue;
    content?: ListWidgetValue;
    isInverted: boolean;
    scrollToBtn: ScrollToBtnEnum;
    iconScrollToBottom: DynamicValue<NativeIcon>;
    iconScrollToTop: DynamicValue<NativeIcon>;
    enablePagination: boolean;
    pageSize: number;
    pageEndAction?: ActionValue;
}

export interface NativeAdvancedListViewPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    data: {} | { type: string } | null;
    content: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    isInverted: boolean;
    scrollToBtn: ScrollToBtnEnum;
    iconScrollToBottom: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    iconScrollToTop: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    enablePagination: boolean;
    pageSize: number | null;
    pageEndAction: {} | null;
}
