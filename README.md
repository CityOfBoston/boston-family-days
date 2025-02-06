# Boston Family Days Registration

## Overview

The Boston Family Days program is an expansion of the BPS Sundays initiative, providing students in Boston with free access to various cultural institutions such as museums, gardens, zoos, and aquariums on the first and second Sunday of each month. This project supports the registration process for the program, offering a user-friendly interface for families to sign up and manage their passes.

## Project Architecture

The project is structured into several key components:

- **Frontend**: This is a React application built with Vite, TypeScript, and Tailwind CSS. It utilizes the USWDS patterns library and Boston.gov styling to ensure a cohesive user experience. The frontend is embedded into the Drupal-powered Boston.gov official page at [Boston Family Days Signup](https://www.boston.gov/family-days-signup). More information about the program can be found on the [Boston Family Days landing page](https://www.boston.gov/departments/arts-and-culture/boston-family-days).

- **Functions**: This directory contains the business logic implemented via serverless Firebase Cloud Functions. These functions handle various backend processes required for the registration and management of the program.

- **Firebase Services**: The project leverages several Firebase services, including hosting, storage, Firestore databases, and the secrets manager, to provide a robust and scalable infrastructure.

## Key Files and Directories

- **firebase.json**: This file configures Firebase services for the project. It specifies the rules and indexes for Firestore, the source and codebase for functions, and the hosting settings, including CORS headers for static assets.

- **firestore.indexes.json**: This file defines the indexes for the Firestore database, optimizing query performance for the registration data. It includes an index on the `registrationData` collection, sorted by `email` and `createdAt`.

- **schema.md**: This document outlines the data schema used in the project. It details the structure of the registration and demographic data stored in Firestore, which is crucial for ensuring data security and privacy compliance.

## Directory Structure

### /frontend
A React Vite TypeScript Tailwind app using USWDS patterns library with Boston.gov styling.

### /functions
Contains serverless Firebase Cloud Functions for business logic.

### /public
Static assets for hosting.

### /firebase.json
Configuration for Firebase services.

### /firestore.indexes.json
Index definitions for Firestore.

### /schema.md
Data schema for Firestore.