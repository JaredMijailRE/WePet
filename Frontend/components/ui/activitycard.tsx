import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'; // Asegúrate de importar Text

type ColorProp = {
    border: string;
    fill: string;
    text: string;
};

type CardColorsType = {
    completed: ColorProp;
    inprogress: ColorProp;
    expired: ColorProp;
    default: ColorProp;
};

const CARD_COLORS: CardColorsType = { 
    completed:  { border: '#2f9e44', fill: '#b2f2bb', text: '#40c057' },
    inprogress: { border: '#228be6', fill: '#a5d8ff', text: '#4dabf7' },
    expired:    { border: '#d0bfff', fill: '#f3f0ff', text: '#d0bfff' },
    default:    { border: '#000',    fill: '#fff',    text: '#000'    },
};

export type ValidCardState = Exclude<keyof CardColorsType, 'default'>;
const VALID_STATES: ValidCardState[] = ['completed', 'inprogress', 'expired'];

export const getEstadoVisual = (estadoItem: string): ValidCardState => {
  if (VALID_STATES.includes(estadoItem as ValidCardState)) {
    return estadoItem as ValidCardState; 
  }
  
  return 'inprogress'; 
};

interface ActivityCardsProps {
    title: string; 
    group: string;
    exp: number;
    description: string;
    end_date: string; // Esto es un datetime...
    state: ValidCardState;
    handlePress: () => void;
}

const ActivityCards = ({ title, group, exp, description, end_date, state, handlePress }: ActivityCardsProps) => { 
    const validState = state as keyof CardColorsType;
    const colors: ColorProp = CARD_COLORS[validState] || CARD_COLORS.default; 
    
    return(
        <TouchableOpacity 
            style={[ styles.cardContainer, { backgroundColor: colors.fill, borderColor: colors.border} ]}
            onPress={handlePress} 
        >

        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 7 }}>
            <Text style={{ color: colors.text, fontWeight: 'bold'}}>
                {title}
            </Text>
            <Text style={{ color: colors.text, fontSize: 11 }}>
                {group}
            </Text>
            </View>

            <View style={{ flex: 2, alignItems: 'flex-end' }}>
            <Text style={{ color: colors.text, fontWeight: 'bold'}}>
                {end_date}
            </Text>
            <Text style={{ color: colors.text, fontSize: 11 }}>
                +{exp} exp
            </Text>    
            </View>
        </View>

        <View style={{ marginTop: 5 }}>
           <Text style={styles.descriptionText}>
                {description}
            </Text> 
        </View>

        <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: colors.text, fontSize: 11}}>
            {state}
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