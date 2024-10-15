import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from './index';
import { MemoryRouter } from 'react-router-dom';

// Mock out the entire firebase module to prevent any initialization errors
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}));

// Mock firebase/auth module to prevent calling real authentication methods
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(), // Mock sign-up method
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

describe('RegisterPage Component', () => {

    // Test to check if the Register form renders correctly with necessary fields
    it('renders register form with necessary fields', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <RegisterPage />
                </MemoryRouter>
            );
        });

        // Check if the "Register" heading is present
        expect(screen.getByRole('heading', { level: 2, name: 'Register' })).toBeInTheDocument();

        // Check if the "Email" input field is rendered
        expect(screen.getByTestId("email")).toBeInTheDocument();

        // Check if the "Password" input field is rendered
        expect(screen.getByTestId("password")).toBeInTheDocument();

        // Check if the "Confirm Password" input field is rendered
        expect(screen.getByTestId("confirmPassword")).toBeInTheDocument();

        // Check if the "Register" button is rendered
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();

        // Check if the "Already have an account?" link is rendered
        expect(screen.getByText(/already having an account\?/i)).toBeInTheDocument();
    });

    // Test to check if an error message is shown when passwords don't match
    it('shows an error message when passwords do not match', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <RegisterPage />
                </MemoryRouter>
            );
        });

        // Input data into the email, password, and confirm password fields
        fireEvent.change(screen.getByTestId("email").querySelector('input'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId("password").querySelector('input'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId("confirmPassword").querySelector('input'), { target: { value: 'password321' } });

        // Simulate form submission
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        // Check if the error message is displayed
        expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument();
    });
});