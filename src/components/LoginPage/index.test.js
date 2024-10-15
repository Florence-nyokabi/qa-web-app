import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './index';
import { MemoryRouter } from 'react-router-dom';

// Mock out the entire firebase module to prevent any initialization errors
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}));

// Mock firebase/auth module to prevent calling real authentication methods
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
        signInWithEmailAndPassword: jest.fn(), // Mock sign-in method
        sendPasswordResetEmail: jest.fn(), // Mock password reset method
    })),
}));

// Mock firebaseConfig to prevent any real Firebase configuration or authentication
jest.mock('../../firebaseConfig', () => ({
    auth: { currentUser: null },
    firebaseConfig: {},
}));

// Mock react-router-dom to mock useNavigate and Link components
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(), // Mocking useNavigate hook to avoid navigation during tests
    Link: ({ to, children }) => <a href={to}>{children}</a>, // Mock Link component to behave like a simple anchor tag
}));

// Test suite for LoginPage Component
describe('LoginPage Component', () => {

    // Test to check if the login form is rendered with the necessary fields
    it('renders login form with necessary fields', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Check that the login heading is rendered
        expect(screen.getByRole('heading', { level: 2, name: 'Login' })).toBeInTheDocument();

        // Check that the login button is rendered
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();

        // Check that the "Forgot Password" button is rendered
        expect(screen.getByRole('button', { name: /Forgot Password/i })).toBeInTheDocument();
    });

    // Test to verify that the password visibility toggle icon (eye icon) is displayed
    it('displays password visibility toggle icon', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Ensure the eye icon for toggling password visibility is rendered
        const eyeIcon = screen.getByTestId('showPassword');
        expect(eyeIcon).toBeInTheDocument();
    });

    // Test to ensure the password input field has 'password' type initially (password hidden)
    it('should have type "password" when showPassword is false', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        
        // Query the password input field by its test ID
        const passwordInput = screen.getByTestId('password').querySelector('input');

        // Assuming showPassword is false initially, the input type should be "password" to hide the password
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    // Test to check the password visibility toggle functionality (should toggle between "password" and "text")
    it('should toggle input type between "password" and "text" when the eye icon is clicked', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const passwordInput = screen.getByTestId('password').querySelector('input');
        const eyeIcon = screen.getByTestId('showPassword');

        // Initially, the input type should be "password"
        expect(passwordInput).toHaveAttribute('type', 'password');

        // Simulate a click on the eye icon to show the password (toggle visibility)
        fireEvent.click(eyeIcon);

        // After the click, the input type should change to "text"
        expect(passwordInput).toHaveAttribute('type', 'text');

        // Simulate another click to hide the password again
        fireEvent.click(eyeIcon);

        // After the second click, the input type should revert to "password"
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    // Test to check if clicking "Forgot Password" button displays the reset password form
    it('shows reset password form when "Forgot Password" is clicked', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Find the "Forgot Password" button and simulate a click
        const forgotPasswordButton = screen.getByRole('button', { name: /Forgot Password/i });
        fireEvent.click(forgotPasswordButton);

        // Check if the "Reset Password" heading appears
        expect(screen.getByRole('heading', { level: 3, name: 'Reset Password' })).toBeInTheDocument();

        // Check if the email input field for reset is displayed
        expect(screen.getByTestId('email')).toBeInTheDocument();

        // Check if the "Send Reset Email" button is displayed
        expect(screen.getByRole('button', { name: /Send Reset Email/i })).toBeInTheDocument();
    });

    // Test to check if the reset password form is hidden when "Cancel" is clicked
    it('hides reset password form when "Cancel" is clicked', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Simulate clicking on the "Forgot Password" button
        const forgotPasswordButton = screen.getByRole('button', { name: /Forgot Password/i });
        fireEvent.click(forgotPasswordButton);

        // Find and click the "Cancel" button on the reset form
        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);

        // Check that the "Reset Password" heading is no longer in the document
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
    });
});
