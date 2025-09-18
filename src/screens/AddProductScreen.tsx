import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { apiService } from '../services/api';
import { colors } from '../constants/colors';


interface FormData {
    name: string;
    price: string;
    description: string;
    image: string;
}

interface FormErrors {
    name?: string;
    price?: string;
    description?: string;
    image?: string;
}

export const AddProductScreen: React.FC = ({ navigation }: any) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        price: '',
        description: '',
        image: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // name (min 3 chars)
        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Product name must be at least 3 characters';
        }

        if (!formData.price.trim()) {
            newErrors.price = 'Price is required';
        } else {
            const price = parseFloat(formData.price);
            if (isNaN(price) || price <= 0) {
                newErrors.price = 'Price must be a valid number greater than 0';
            }
        }

        // description (min 10 chars)
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        // image URL
        if (!formData.image.trim()) {
            newErrors.image = 'Image URL is required';
        } else {
            const urlPattern = /^https?:\/\/.+/;
            if (!urlPattern.test(formData.image.trim())) {
                newErrors.image = 'Please enter a valid image URL starting with http:// or https://';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });

        // clear error when user starts to type
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const newProduct = {
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                description: formData.description.trim(),
                image: formData.image.trim(),
            };

            await apiService.addProduct(newProduct);

            Alert.alert(
                'Success',
                'Product added successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Home');
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to add product. Please try again.');
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (
        field: keyof FormData,
        label: string,
        placeholder: string,
        multiline = false,
        keyboardType: 'default' | 'numeric' | 'url' = 'default'
    ) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.textArea,
                    errors[field] && styles.inputError,
                ]}
                placeholder={placeholder}
                value={formData[field]}
                onChangeText={(value) => handleInputChange(field, value)}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                keyboardType={keyboardType}
                autoCapitalize={field === 'image' ? 'none' : 'sentences'}
                autoCorrect={field !== 'image'}
            />
            {errors[field] && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Go Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Product</Text>
                <View style={styles.placeholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.form}>
                        {renderInput('name', 'Product Name *', 'Enter product name')}
                        {renderInput('price', 'Price *', 'Enter price', false, 'numeric')}
                        {renderInput('description', 'Description *', 'Enter product description...', true)}
                        {renderInput('image', 'Image URL *', 'Enter image URL', false, 'url')}

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Adding ....' : 'Add Product'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.buttonSecondary,
        borderRadius: 6,
    },
    backButtonText: {
        fontSize: 16,
        color: colors.textTertiary,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    placeholder: {
        width: 60,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    form: {
        backgroundColor: colors.white,
        margin: 16,
        borderRadius: 12,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textTertiary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.borderInput,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.textPrimary,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontSize: 14,
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: colors.buttonDisabled,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});
