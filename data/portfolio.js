export const experiences = [
    {
        year: "Jan 2024 - Present",
        role: "Systems Developer & Data Analyst (Intern)",
        company: "Ministry of Trade (Bappebti)",
        location: "Jakarta, Indonesia",
        details: "Developing a transaction management system for commodity futures trading via Laravel 12 & Chart.js. conducting data analysis on legal vs. illegal trading entities to enhance regulatory insights.",
    },
    {
        year: "Sep 2023 - Dec 2023",
        role: "Freelance Systems Developer",
        company: "PT Kumaitu Kargo",
        location: "Remote",
        details: "Built a digital pre-departure safety (K3) verification system for cargo drivers using Google Cloud (Sheets/Forms) as a centralized database, replacing manual paperwork.",
    },
    {
        year: "Jun 2023 - Aug 2023",
        role: "Java Developer Intern (KKP)",
        company: "PT Malik Hidayatullah",
        location: "Jakarta, Indonesia",
        details: "Developed SIKARGO, a desktop application for managing warehouse cargo data, primarily focusing on recording shipping and receiving information.",
    },
];

export const projects = [
    {
        title: "SIKARGO (Cargo Information System)",
        description: "A desktop application used to manage and record daily warehouse cargo data, including tracking the status of stock for shipping and receiving operations.",
        techStack: ["Java", "Desktop App", "MySQL"],
        image: "/img/sikargo/halaman login.png",
        link: "#",
        screenshots: [
            "/img/sikargo/halaman login.png",
            "/img/sikargo/dashboard.png",
            "/img/sikargo/tampilan data master.png",
            "/img/sikargo/tampilan data client.png",
            "/img/sikargo/tampilan data supir.png",
            "/img/sikargo/Tampilan data pengiriman.png",
            "/img/sikargo/tampilan data penerimaan.png",
            "/img/sikargo/Tampilan proses.png",
            "/img/sikargo/tampilan stok barang.png",
            "/img/sikargo/Tampilan report.png",
        ],
    },
    {
        title: "Bappebti Legality Check Log Analysis",
        description: "Analyzed the Bappebti legality check web portal's search logs. Cleansed raw data using Python, and designed an interactive dashboard in Looker Studio to track web performance and identify user search trends for both legal and illegal trading entities.",
        techStack: ["Python", "Data Cleansing", "Looker Studio"],
        image: "/img/analisis data  log pencarian/executive summary.png",
        link: "#",
        screenshots: ["/img/analisis data  log pencarian/executive summary.png"],
        isConfidential: true,
    },
    {
        title: "SIDATA (Exchange Data Management)",
        description: "A web platform named SIDATA developed to manage and visualize monthly and annual transaction reports from commodity exchanges. Built with Laravel 12 and Bootstrap, featuring interactive data visualizations powered by Chart.js.",
        techStack: ["Laravel 12", "Bootstrap", "Chart.js", "MySQL"],
        image: "/img/sidataapp/sidata.png",
        link: "#",
        screenshots: ["/img/sidataapp/sidata.png", "/img/sidataapp/sidata.png"],
        isLocked: true,
    },
];
