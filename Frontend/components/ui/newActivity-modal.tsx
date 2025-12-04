import React, { useState } from 'react';
import {Picker} from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
    Modal, View, Text, StyleSheet, TextInput, 
    KeyboardAvoidingView, Platform, Pressable,
    TouchableOpacity
} from 'react-native';

interface ActivityForm {
    group: string;
    title: string;
    description: string;
    deadline: string; 
}

interface CreateActivityModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: ActivityForm) => void;
}

const groups = [
    {id: 1, name:'Group 1'}, 
    {id: 2, name:'Group 2'},
    {id: 3, name:'Group 3'},
    {id: 4, name:'Group 4'},
    {id: 5, name:'Group 5'},
];

const CreateActivityModal = ({ visible, onClose, onSubmit }: CreateActivityModalProps) => {
    const [selectedGroup, setSelectedGroup] = useState('-');
    const [date,          setDate]          = useState(new Date(2025, 11, 5));
    const [show,          setShow]          = useState(false);
    const [formData,      setFormData]      = useState<ActivityForm>({
        group: '',
        title: '',
        description: '',
        deadline: '', 
    });
    
    const handleChange = (name: keyof ActivityForm, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(!show);
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({ group: '-', title: '', description: '', deadline: '' });
        setShow(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
        <Pressable onPress={onClose} style={styles.mainContainer}>

            <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.keyAvoidContainer}
            >
            <Pressable style={styles.modalView}>
        
                <Text style={styles.title}>Create a New Activity!</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.label}>Select a Group:</Text>
                <Picker selectedValue={selectedGroup}
                    onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}
                    style={styles.groupPicker}
                >
                    {groups.map((group, index) => (
                        <Picker.Item key={index} label={group.name} value={group.id} />
                    ))}
                </Picker>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                <Text style={styles.label}>Title:</Text>
                <TextInput
                    style={styles.titleInput}
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                /> 
                </View>

                <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={styles.descriptionInput}
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                    multiline
                    numberOfLines={4}
                /> 

                <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Deadline:</Text>
                <Pressable onPress={showDatepicker} style={styles.datePickerButton}>
                    <Text style={{ color: '#000' }}> {date.toLocaleDateString()} </Text>
                </Pressable>
                </View>
                {show && (
                    <DateTimePicker
                    value={date}
                    mode={'date'}
                    onChange={onChange}
                    />
                )}

                <View style={{flexDirection: "row", marginTop: 15}}>
                    <View style={{ flex: 2 }}/>

                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose()} >
                    <Text style={{textAlign: 'center', color: '#9c76c2'}}>cancel</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity style={styles.okButton} onPress={() => handleSubmit()}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>OK</Text>
                    </TouchableOpacity>
                </View>

            </Pressable>
            </KeyboardAvoidingView>

        </Pressable>
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
    keyAvoidContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        width: '80%',

        shadowColor: '#595959',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#444'
    },

    label: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '500',
        marginRight: 10,
    },
    groupPicker: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 13,
    },
    titleInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: 14,
        flex: 1,
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        fontSize: 12,
        marginBottom: 5, 
    },
    datePickerButton: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 10,
        fontSize: 14,
    },

    closeButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 5,
    },
    okButton: {
        backgroundColor: "#9c76c2",
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 5,
    },
});

export default CreateActivityModal;