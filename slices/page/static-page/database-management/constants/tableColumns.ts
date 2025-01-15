import { DatabaseTable, DatabaseColumn } from "shared/types/global";
import { ReactNode } from "react";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface Client {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface Employee {
  name: string;
  position: string;
  department: string;
  email: string;
}

interface Course {
  title: string;
  instructor: string;
  duration: string;
  level: string;
}

interface Project {
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: string;
  type: string;
  status: string;
}

interface DesignAsset {
  name: string;
  type: string;
  size: string;
  lastModified: string;
  creator: string;
}

function createColumns<T>(config: { key: keyof T; header: string }[]): Column<T>[] {
  return config.map(({ key, header }) => ({ key, header }));
}

export const clientColumns: Column<Client>[] = createColumns<Client>([
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "company", header: "Company" },
  { key: "phone", header: "Phone" }
]);

export const employeeColumns: Column<Employee>[] = createColumns<Employee>([
  { key: "name", header: "Name" },
  { key: "position", header: "Position" },
  { key: "department", header: "Department" },
  { key: "email", header: "Email" }
]);

export const courseColumns: Column<Course>[] = createColumns<Course>([
  { key: "title", header: "Title" },
  { key: "instructor", header: "Instructor" },
  { key: "duration", header: "Duration" },
  { key: "level", header: "Level" }
]);

export const projectColumns: Column<Project>[] = createColumns<Project>([
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "manager", header: "Project Manager" }
]);

export const transactionColumns: Column<Transaction>[] = createColumns<Transaction>([
  { key: "id", header: "ID" },
  { key: "date", header: "Date" },
  { key: "amount", header: "Amount" },
  { key: "type", header: "Type" },
  { key: "status", header: "Status" }
]);

export const designAssetColumns: Column<DesignAsset>[] = createColumns<DesignAsset>([
  { key: "name", header: "Name" },
  { key: "type", header: "Type" },
  { key: "size", header: "Size" },
  { key: "lastModified", header: "Last Modified" },
  { key: "creator", header: "Creator" }
]);

type DatabaseTableColumn = Column<DatabaseTable> & {
  key: keyof DatabaseTable;
  render?: (value: DatabaseTable[keyof DatabaseTable], item: DatabaseTable) => ReactNode;
};

export const databaseTableColumns: DatabaseTableColumn[] = [
  { 
    key: "name", 
    header: "Table Name" 
  },
  { 
    key: "columns", 
    header: "Columns",
    render: (value) => {
      const columns = value as DatabaseColumn[];
      return columns?.length.toString() ?? "0";
    }
  },
  { 
    key: "feature", 
    header: "Type",
    render: (value) => {
      const feature = value as DatabaseTable["feature"];
      return feature?.entityType ?? "-";
    }
  }
];
