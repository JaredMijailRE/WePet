import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ActivityItem } from '@/app/(main_nav)/activities';

interface ModalBaseProps {
    activity: ActivityItem;
    visible: boolean; 
    onClose: () => void;
    onUpdate: (item: ActivityItem) => void;
}

const ActivityModal = ({ activity, visible, onClose, onUpdate }: ModalBaseProps) => {
    const isFinished = activity.state === 'completed' || activity.state === 'expired'

    return (
        <Modal
        animationType="fade" 
        transparent={true}  
        visible={visible}
        onRequestClose={onClose} 
        >
        <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.mainContainer}>
            
            <TouchableWithoutFeedback>
            <View style={styles.modalView}>
                
               <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 7 }}>
                    <Text style={{ color: '#000', fontWeight: 'bold'}}>
                        {activity.title}
                    </Text>
                    <Text style={{ color: '#595959', fontSize: 11 }}>
                        {activity.group}
                    </Text>
                    </View>

                    <View style={{ flex: 3, alignItems: 'flex-end' }}>
                    <Text style={{ color: '#000', fontWeight: 'bold'}}>
                        {activity.end_date}
                    </Text>
                    <Text style={{ color:'#595959', fontSize: 11 }}>
                        +{activity.exp} exp
                    </Text>    
                    </View>
                </View>
            
                <ScrollView>
                    <Text style={{ color: '#595959', fontSize: 12 } }>
                        {activity.description}
                    </Text> 
                </ScrollView>
                
                {!isFinished && (
                <TextInput 
                style={styles.textInput}
                placeholder='Write something...'
                placeholderTextColor={'#595959'}
                />
                )}
                
                {!isFinished && (
                <View style={{flexDirection: "row", marginTop: 15}}>
                    <View style={{ flex: 2 }}/>

                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose()} >
                    <Text style={{textAlign: 'center', color: '#9c76c2'}}>cancel</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity style={styles.okButton} onPress={() => onUpdate(activity)}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>OK</Text>
                    </TouchableOpacity>
                </View>
                )}

                {isFinished && (
                <View style={{flexDirection: "row", marginTop: 15}}>
                    <View style={{ flex: 3 }}/>
    
                    <TouchableOpacity style={styles.okButton} onPress={() => onClose()}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>OK</Text>
                    </TouchableOpacity>
                </View>
                )}

            </View>
            </TouchableWithoutFeedback>
            
        </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000020',
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,

        shadowColor: '#595959',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxHeight: '30%',
    },
    textInput: {
        marginTop: 15,
        padding: 5,
        borderRadius: 10,

        borderWidth: 1,
        borderColor: '#', 
    },

    closeButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 5,
    },
    okButton: {
        backgroundColor: "#9c76c2",
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 5,
    },
});

export default ActivityModal;