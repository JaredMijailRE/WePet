import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'; 
import { ActivityItem } from '@/app/(main_nav)/activities';

type ColorProp = {
    border: string;
    fill: string;
    text: string;
};

type CardColorsType = {
    completed: ColorProp;
    active: ColorProp;
    expired: ColorProp;
    default: ColorProp;
};

const CARD_COLORS: CardColorsType = { 
    completed:  { border: '#2f9e44', fill: '#b2f2bb', text: '#40c057' },
    active:     { border: '#228be6', fill: '#a5d8ff', text: '#4dabf7' },
    expired:    { border: '#d0bfff', fill: '#f3f0ff', text: '#d0bfff' },
    default:    { border: '#000',    fill: '#fff',    text: '#000'    },
};

interface ActivityCardsProps {
    item: ActivityItem;
    handlePress: (item:ActivityItem) => void;
}

const ActivityCards = ({ item, handlePress }: ActivityCardsProps) => { 
    const validState = item.state as keyof CardColorsType;
    const colors: ColorProp = CARD_COLORS[validState] || CARD_COLORS.default; 
    
    return(
        <TouchableOpacity 
            style={[ styles.cardContainer, { backgroundColor: colors.fill, borderColor: colors.border} ]}
            onPress={() => handlePress(item)} 
        >

        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: 'bold'}}>
                {item.title}
            </Text>
            <Text style={{ color: colors.text, fontSize: 11 }}>
                {item.group}
            </Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ color: colors.text, fontWeight: 'bold'}}>
                {item.end_date}
            </Text>
            <Text style={{ color: colors.text, fontSize: 11 }}>
                +{item.exp} exp
            </Text>    
            </View>
        </View>

        <View style={{ marginTop: 5 }}>
           <Text 
           style={styles.descriptionText}
           numberOfLines={3}
           ellipsizeMode='tail'
           >
                {item.description}
            </Text> 
        </View>

        <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: colors.text, fontSize: 11}}>
            {item.state}
            </Text>  
        </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        padding: 10,
        borderRadius: 6,
        marginVertical: 4,
        borderWidth: 1, 
    },

    descriptionText: {
        color: '#595959', 
        fontSize: 12,
    },
});

export default ActivityCards;