/****** Object:  Table [dbo].[AppUser]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUser](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](30) NOT NULL,
	[LastName] [nvarchar](30) NULL,
	[DateOfBirth] [date] NOT NULL,
	[PhoneNumber] int NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[Role] [nvarchar](15) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[MEMBERSHIP]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MEMBERSHIP](
	[membership_id] [int] IDENTITY(1,1) NOT NULL,
	[instructor_id] [int] NULL,
	[membership_name] [varchar] (20) NOT NULL,
	[sessions] [integer] NOT NULL,
	[membership_price] [integer] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[membership_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[CLIENT]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLIENT](
	[client_id] [int] IDENTITY(1,1) NOT NULL,
	[membership_id] [integer] NULL,
	[boots_id] [integer] NULL,
	[class_id] [integer] NULL,
	[instructor_id] [integer] NULL,
	[first_name] [nvarchar](30) NOT NULL,
	[last_name] [nvarchar](30) NULL,
	[dob] [date] NOT NULL,
	[phone_number] [integer] NOT NULL,
	[email] [nvarchar](60) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[attendance] [integer] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[client_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[BOOTS]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOTS](
	[boots_id] [int] IDENTITY(1,1) NOT NULL,
	[client_id] [int] NULL,
	[admin_id] [int] NULL,
	[boots_size] [nvarchar](3) NOT NULL,
	[price] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[boots_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[CLASS]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLASS](
	[class_id] [int] IDENTITY(1,1) NOT NULL,
	[instructor_id] [int] NULL,
	[client_id] [int] NULL,
	[class_date] [date] NOT NULL,
	[class_time] [time] (7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[class_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[INSTRUCTOR]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[INSTRUCTOR](
	[instructor_id] [int] IDENTITY(1,1) NOT NULL,
	[admin_id] [int] NULL,
	[client_id] [int] NULL,
	[first_name] [nvarchar](30) NOT NULL,
	[last_name][nvarchar](30)NULL,
	[dob] [date] NOT NULL,
	[phone_number] [integer] NOT NULL,
	[email] [nvarchar](60) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[instructor_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

/****** Object:  Table [dbo].[ADMIN]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ADMIN](
	[admin_id] [int] IDENTITY(1,1) NOT NULL,
	[membership_id] [integer] NULL,
	[boots_id] [integer] NULL,
	[class_id] [integer] NULL,
	[instructor_id] [integer] NULL,
	[first_name] [nvarchar](50) NOT NULL,
	[last_name] [nvarchar](50) NULL,
	[dob] [date] NOT NULL,
	[phone_number] [integer] NOT NULL,
	[email] [nvarchar](60) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[admin_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Here I need to double check with someone ******/
GO
SET IDENTITY_INSERT [dbo].[AppUser] ON 
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [Email],[DateOfBirth],[PhoneNumber] [Password], [Role]) VALUES (1, N'Client', N'One','1981-03-03', 1122334455, N'client@bounceanddance.com', N'Client1!', N'user')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [Email],[DateOfBirth],[PhoneNumber] [Password], [Role]) VALUES (1, N'Instructor', N'One','1990-01-01', 1234567891, N'instructor@bounceanddance.com', N'Instructor1!', N'user')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [Email],[DateOfBirth],[PhoneNumber] [Password], [Role]) VALUES (1, N'Admin', N'One','1989-02-02', 2233445566, N'admin@bounceanddance.com', N'Administrator1!', N'admin')
GO
SET IDENTITY_INSERT [dbo].[AppUser] OFF
GO

/****** Here I need to double check with someone ******/


GO
SET IDENTITY_INSERT [dbo].[CLIENT] ON 
GO
INSERT [dbo].[CLIENT] ([client_id], [first_name], [last_name], [dob], [phone_number], [email], [password],[attendance]) VALUES (1, N'Joe', N'Cole', '1981-03-03', 1122334455 , N'jcole@gmail.com', N'client',0)
GO
INSERT [dbo].[CLIENT] ([client_id], [first_name], [last_name], [dob], [phone_number], [email], [password], [attendance]) VALUES (2, N'Frank', N'Lampard', '1990-01-01', 1234567891 , N'flampard@gmail.com', N'client1',0)
GO
INSERT [dbo].[CLIENT] ([client_id], [first_name], [last_name], [dob], [phone_number], [email], [password],[attendance]) VALUES (3, N'John', N'Terry', '1989-02-02', 2233445566, N'jterry@gmail.com', N'client2',0)
GO
SET IDENTITY_INSERT [dbo].[CLIENT] OFF
GO

SET IDENTITY_INSERT [dbo].[MEMBERSHIP] ON 
GO
INSERT [dbo].[MEMBERSHIP] ([membership_id],[membership_name], [sessions], [membership_price]) VALUES (1, N'Silver', 5, 50)
GO
INSERT [dbo].[MEMBERSHIP] ([membership_id], [membership_name], [sessions], [membership_price]) VALUES (2, N'Gold', 7, 65)
GO
INSERT [dbo].[MEMBERSHIP] ([membership_id],[membership_name], [sessions], [membership_price]) VALUES (3, N'Platinium', 11, 100)
GO
SET IDENTITY_INSERT [dbo].[MEMBERSHIP] OFF
GO

SET IDENTITY_INSERT [dbo].[BOOTS] ON 
GO
INSERT [dbo].[BOOTS] ([boots_id], [boots_size], [price]) VALUES (1, N'S',10 )
GO
INSERT [dbo].[BOOTS] ([boots_id], [boots_size], [price]) VALUES (2, N'M', 10)
GO
SET IDENTITY_INSERT [dbo].[BOOTS] OFF
GO

GO
SET IDENTITY_INSERT [dbo].[INSTRUCTOR] ON 
GO
INSERT [dbo].[INSTRUCTOR] ([instructor_id], [first_name], [last_name], [dob], [phone_number], [email], [password]) VALUES (1, N'Instructor', N'One', '1989-07-07', 1111111111 , N'instructorone@bounceanddance.com', N'instructor1')
GO
INSERT [dbo].[INSTRUCTOR] ([instructor_id], [first_name], [last_name], [dob], [phone_number], [email], [password]) VALUES (2, N'Instructor', N'Two', '1977-08-07', 222222222 , N'instructortwo@bounceanddance.com', N'instructor2')
GO
SET IDENTITY_INSERT [dbo].[INSTRUCTOR] OFF
GO

GO
SET IDENTITY_INSERT [dbo].[ADMIN] ON 
GO
INSERT [dbo].[ADMIN] ([admin_id], [first_name], [last_name], [dob], [phone_number], [email], [password]) VALUES (1, N'Alex', N'Andronic', '1992-03-22', 1111111111 , N'admin@bounceanddance.com', N'admin1')
GO
SET IDENTITY_INSERT [dbo].[ADMIN] OFF
GO
