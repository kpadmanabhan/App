import {useIsFocused} from '@react-navigation/native';
import {Str} from 'expensify-common';
import React, {useEffect, useRef, useState} from 'react';
// eslint-disable-next-line no-restricted-imports
import type {Text as RNText} from 'react-native';
import {StyleSheet} from 'react-native';
import PressableWithSecondaryInteraction from '@components/PressableWithSecondaryInteraction';
import Text from '@components/Text';
import Tooltip from '@components/Tooltip';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useStyleUtils from '@hooks/useStyleUtils';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import {canUseTouchScreen} from '@libs/DeviceCapabilities';
import {hideContextMenu, showContextMenu} from '@pages/home/report/ContextMenu/ReportActionContextMenu';
import CONST from '@src/CONST';
import type {BaseAnchorForCommentsOnlyProps, LinkProps} from './types';

/*
 * This is a default anchor component for regular links.
 */
function BaseAnchorForCommentsOnly({
    onPressIn,
    onPressOut,
    href = '',
    rel = '',
    target = '',
    children = null,
    style,
    onPress,
    linkHasImage,
    wrapperStyle,
    ...rest
}: BaseAnchorForCommentsOnlyProps) {
    const theme = useTheme();
    const styles = useThemeStyles();
    const StyleUtils = useStyleUtils();
    const linkRef = useRef<RNText>(null);
    const flattenStyle = StyleSheet.flatten(style);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(
        () => () => {
            hideContextMenu();
        },
        [],
    );

    const {shouldUseNarrowLayout} = useResponsiveLayout();

    const linkProps: LinkProps = {};
    if (onPress) {
        linkProps.onPress = onPress;
    } else {
        linkProps.href = href;
    }
    const defaultTextStyle = canUseTouchScreen() || shouldUseNarrowLayout ? {} : {...styles.userSelectText, ...styles.cursorPointer};
    const hoverStyle = isHovered ? StyleUtils.getColorStyle(theme.linkHover) : {};
    const isEmail = Str.isValidEmail(href.replace(/mailto:/i, ''));
    const linkHref = !linkHasImage ? href : undefined;
    const isFocused = useIsFocused();

    return (
        <PressableWithSecondaryInteraction
            inline
            suppressHighlighting
            style={[styles.cursorDefault, !!flattenStyle.fontSize && StyleUtils.getFontSizeStyle(flattenStyle.fontSize)]}
            onSecondaryInteraction={(event) => {
                showContextMenu({
                    type: isEmail ? CONST.CONTEXT_MENU_TYPES.EMAIL : CONST.CONTEXT_MENU_TYPES.LINK,
                    event,
                    selection: href,
                    contextMenuAnchor: linkRef.current,
                });
            }}
            onPress={(event) => {
                if (!linkProps.onPress) {
                    return;
                }

                event?.preventDefault();
                linkProps.onPress();
            }}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            role={CONST.ROLE.LINK}
            accessibilityLabel={href}
            wrapperStyle={wrapperStyle}
        >
            <Tooltip
                text={linkHref}
                isFocused={isFocused}
            >
                <Text
                    ref={linkRef}
                    style={StyleSheet.flatten([style, defaultTextStyle, hoverStyle])}
                    role={CONST.ROLE.LINK}
                    hrefAttrs={{
                        rel,
                        target: isEmail || !linkProps.href ? '_self' : target,
                    }}
                    href={linkHref}
                    suppressHighlighting
                    // Add testID so it gets selected as an anchor tag by SelectionScraper
                    testID="a"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest}
                >
                    {children}
                </Text>
            </Tooltip>
        </PressableWithSecondaryInteraction>
    );
}

BaseAnchorForCommentsOnly.displayName = 'BaseAnchorForCommentsOnly';

export default BaseAnchorForCommentsOnly;
