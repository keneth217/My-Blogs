import {supabase} from "@/services/UseSupabase.ts";
import type {AuthError, User, Session} from "@supabase/supabase-js";

type Provider = 'github' | 'google' | 'facebook' | 'twitter' | 'discord' | 'azure' | 'gitlab' | 'bitbucket' | 'apple';

interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export const AuthService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('Login error:', error);
                return {user: null, session: null, error};
            }

            return {user: data.user, session: data.session, error: null};
        } catch (error) {
            console.error('Unexpected login error:', error);
            return {
                user: null,
                session: null,
                error: {
                    message: error instanceof Error ? error.message : 'Login failed',
                    name: 'AuthError'
                }
            };
        }
    },

    async logout(): Promise<{ error: AuthError | null }> {
        try {
            const {error} = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                return {error};
            }
            return {error: null};
        } catch (error) {
            console.error('Unexpected logout error:', error);
            return {
                error: {
                    message: error instanceof Error ? error.message : 'Logout failed',
                    name: 'AuthError'
                }
            };
        }
    },
    async register(
        email: string,
        password: string,
        metadata?: { fullName?: string }
    ): Promise<AuthResponse> {
        try {
            console.log('Registering user:', { email, metadata });

            // 1. Create auth user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: metadata?.fullName || '',
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                console.error('Auth error:', error);
                throw error;
            }

            // 2. Create profile if user exists
            if (data.user?.id) {
                try {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: data.user.id,
                            email: data.user.email,
                            full_name: metadata?.fullName || '',
                            username: metadata?.fullName?.toLowerCase().replace(/\s+/g, '_') ||
                                email.split('@')[0],
                            created_at: new Date().toISOString()
                        });

                    if (profileError) {
                        console.error('Profile error:', profileError);
                        // Queue for retry or notify admin
                    }
                } catch (profileErr) {
                    console.error('Profile creation failed:', profileErr);
                }
            }

            return {
                user: data.user,
                session: data.session,
                error: null
            };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                user: null,
                session: null,
                error: {
                    message: error instanceof Error ? error.message : 'Registration failed',
                    name: 'AuthError'
                }
            };
        }
    },
    async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        try {
            const {error} = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            });

            if (error) {
                console.error('Password reset error:', error);
                return {error};
            }
            return {error: null};
        } catch (error) {
            console.error('Unexpected password reset error:', error);
            return {
                error: {
                    message: error instanceof Error ? error.message : 'Password reset failed',
                    name: 'AuthError'
                }
            };
        }
    },

    async isAuthenticated(): Promise<boolean> {
        try {
            const {data: {session}} = await supabase.auth.getSession();
            return session !== null;
        } catch (error) {
            console.error('Authentication check error:', error);
            return false;
        }
    },


    async getUser(): Promise<{ user: User | null; error: AuthError | null }> {
        try {
            const {data: {user}, error} = await supabase.auth.getUser();
            console.log("user details in service: "+   user?.id);
            if (error) {
                console.error('Get user error:', error);
                return {user: null, error};
            }

            if (!user) {
                console.warn('No user found');
                return {user: null, error: {message: 'No user found', name: 'AuthError'}};
            }

            return {user, error: null};
        } catch (error) {
            console.error('Unexpected get user error:', error);
            return {
                user: null,
                error: {
                    message: error instanceof Error ? error.message : 'Failed to get user',
                    name: 'AuthError'
                }
            };
        }
    },

    async updateUser(updates: {
        email?: string;
        password?: string;
        data?: Record<string, any>;
    }): Promise<{ user: User | null; error: AuthError | null }> {
        try {
            const {data: {user}, error} = await supabase.auth.updateUser(updates);

            if (error) {
                console.error('Update user error:', error);
                return {user: null, error};
            }

            return {user, error: null};
        } catch (error) {
            console.error('Unexpected update user error:', error);
            return {
                user: null,
                error: {
                    message: error instanceof Error ? error.message : 'User update failed',
                    name: 'AuthError'
                }
            };
        }
    },

    async deleteUser(): Promise<{ error: AuthError | null }> {
        try {
            const {data: {user}, error: getUserError} = await supabase.auth.getUser();

            if (getUserError || !user) {
                console.error('Get user for deletion error:', getUserError);
                return {error: getUserError || {message: 'User not found', name: 'AuthError'}};
            }

            const {error: deleteError} = await supabase.auth.admin.deleteUser(user.id);

            if (deleteError) {
                console.error('Delete user error:', deleteError);
                return {error: deleteError};
            }

            return {error: null};
        } catch (error) {
            console.error('Unexpected delete user error:', error);
            return {
                error: {
                    message: error instanceof Error ? error.message : 'User deletion failed',
                    name: 'AuthError'
                }
            };
        }
    },

    async sendMagicLink(email: string): Promise<{ error: AuthError | null }> {
        try {
            const {error} = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                console.error('Magic link error:', error);
                return {error};
            }
            return {error: null};
        } catch (error) {
            console.error('Unexpected magic link error:', error);
            return {
                error: {
                    message: error instanceof Error ? error.message : 'Failed to send magic link',
                    name: 'AuthError'
                }
            };
        }
    },

    async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
        try {
            const {data: {session}, error} = await supabase.auth.getSession();

            if (error) {
                console.error('Get session error:', error);
                return {session: null, error};
            }

            return {session, error: null};
        } catch (error) {
            console.error('Unexpected get session error:', error);
            return {
                session: null,
                error: {
                    message: error instanceof Error ? error.message : 'Failed to get session',
                    name: 'AuthError'
                }
            };
        }
    },

    async loginWithSocial(provider: Provider): Promise<{ error: AuthError | null }> {
        try {
            const {error} = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: "http://localhost:5173/profile",
                    scopes: provider === 'github' ? 'repo,user' : undefined
                }
            });

            if (error) {
                console.error(`${provider} login error:`, error);
                return {error};
            }
            return {error: null};
        } catch (error) {
            console.error(`Unexpected ${provider} login error:`, error);
            return {
                error: {
                    message: error instanceof Error ? error.message : `${provider} login failed`,
                    name: 'AuthError'
                }
            };
        }
    },

    async refreshSession(): Promise<{ session: Session | null; error: AuthError | null }> {
        try {
            const {data: {session}, error} = await supabase.auth.refreshSession();

            if (error) {
                console.error('Refresh session error:', error);
                return {session: null, error};
            }

            return {session, error: null};
        } catch (error) {
            console.error('Unexpected refresh session error:', error);
            return {
                session: null,
                error: {
                    message: error instanceof Error ? error.message : 'Session refresh failed',
                    name: 'AuthError'
                }
            };
        }
    }
};