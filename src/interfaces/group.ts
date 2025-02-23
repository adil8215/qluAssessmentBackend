export interface Group {
  group_id: number;
  group_name: string;
  group_desc?: string | null;
  group_status?: string | null;
  created_at: Date;
  updated_at: Date;
  created_by: number | string;
}
