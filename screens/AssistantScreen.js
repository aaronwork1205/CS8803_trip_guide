import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';


const AssistantScreen = ({ navigation, route }) => {
    const [inputText, setInputText] = useState('');
    const [conversation, setConversation] = useState([]);

    const handleInputChange = (text) => {
        setInputText(text);
    };

    const handleNextButtonPress = async () => {
        try {
            // Perform some action with the inputText
            console.log('Input Text:', inputText);

            // Update the conversation with the user's message
            const updatedConversation = [...conversation, { text: inputText, sender: 'user' }];

            // Send inputText to the local server
            const response = await fetch('http://localhost:8080/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'ggml-gpt4all-j',
                    messages: [{ role: 'user', content: inputText }],
                    temperature: 0.9,
                }),
            });

            // Handle the response
            if (response.ok) {
                const responseData = await response.json();

                // Extract assistant's response
                const assistantMessage = responseData.choices[0].message.content;

                // Update the conversation with both user's and assistant's messages
                const updatedConversationWithResponse = [...updatedConversation, { text: assistantMessage, sender: 'assistant' }];

                // Set the updated conversation state
                setConversation(updatedConversationWithResponse);
            } else {
                console.error('Error:', response.status);
            }

            // Clear the input after using it
            setInputText('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>

            <ScrollView style={styles.conversationContainer} contentContainerStyle={styles.conversationContent}>
                {conversation.map((item, index) => (
                    <Text key={index} style={item.sender === 'user' ? styles.userMessage : styles.assistantMessage}>
                        {item.text}
                    </Text>
                ))}
            </ScrollView>



            {/* Input Bar */}
            <TextInput
                style={styles.input}
                placeholder="Ask anything..."
                value={inputText}
                onChangeText={handleInputChange}
            />

            {/* Next Button */}
            <TouchableOpacity
                onPress={handleNextButtonPress}
                style={styles.sendButton}
            >
                <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex:0,
        position: 'absolute',
        bottom: 0,
        left:0,
        right:0,
        justifyContent: 'flex-end',
        flexDirection: 'column',
        alignItems: 'center',
        // width: '100%',
        paddingHorizontal: 10,
    },
    conversationContainer: {
        flex: 0,
        marginTop: 0,
        marginRight:0,
    },
    conversationContent: {
        justifyContent: 'flex-end',

    },
    userMessage: {
        backgroundColor: '#d3d3d3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
        // justifyContent:'flex-right',
        // width:'100%',
        // borderBottomEndRadius:20,
        alignSelf: 'flex-end',

    },
    assistantMessage: {
        backgroundColor: '#87CEEB',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    input: {
        height: 45,
        width:'100%',
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
        backgroundColor: 'white',
    },
    sendButton: {
        backgroundColor: 'black',
        width: 100,
        height: 40,
        borderRadius: 20,
        marginBottom:20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
    },
});

export default AssistantScreen;
