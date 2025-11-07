export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string;
          name: string;
          color: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          icon: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_entries: {
        Row: {
          id: string;
          habit_id: string;
          date: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          date: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          date?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

