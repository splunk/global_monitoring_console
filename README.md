Splunk Global Monitoring Console (GMC)
Doc Location: https://docs.google.com/document/d/e/2PACX-1vTnB1MU_mUDGz-B87SiSrq0MFndWIO9Tcqe6jtRlfa5b-zVIDW89sKgkRGzVXJOZA4HeBXng5lu4znQ/pub


 The App needs to run on a dedicated Splunk Monitoring Console for the entire enterprise. Also export the Splunk Monitoring Console App Globally and set read for everyone and write for just admin
Required Splunkbase Apps:

    Splunk Common Information Model (CIM): https://splunkbase.splunk.com/app/1621
    Number Display Visualization: https://splunkbase.splunk.com/app/4537
    Lookup File Editor: https://splunkbase.splunk.com/app/1724
    Splunk Machine Learning Toolkit (Optional but highly recommended): https://splunkbase.splunk.com/app/2890
    Python for Scientific Computing (for Linux 64-bit) (Optional but highly recommended): https://splunkbase.splunk.com/app/2882
    Config Explorer (Optional but highly recommended): https://splunkbase.splunk.com/app/4353

Run the following Jobs for the first time from the menu or click on the link:

    GMC Jobs / GMC Gen Jobs / GMC Assets Gen Job
    GMC Jobs / GMC Gen Jobs / GMC Identities Gen Job
        Edit this job and customize it to automatically build splunk_identities_custom_sh_csv_lookup_gen or edit the table manually by clicking on the button:

        GMC Custom Identities Gen Job
        splunk_identities_custom_sh_csv_lookup_gen
    GMC Jobs / GMC Gen Jobs / IDX Tier Gen Jobs / IDX Cluster Configuration
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Search Head Cluster Configuration Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Search Concurrency
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Dashboards
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Reports/Alerts
    GMC Jobs / GMC Gen Jobs / IDX Tier Gen Jobs / Indexes
    GMC Jobs / GMC Gen Jobs / IDX Tier Gen Jobs / IDX Cluster Indexes Volumes Gen Job
    GMC Jobs / GMC Gen Jobs / All Tiers Gen Jobs / Data Inputs Gen Job
    GMC Jobs / GMC Gen Jobs / All Tiers Gen Jobs / Splunk Apps Gen Job
    GMC Jobs / GMC Gen Jobs / All Tiers Gen Jobs / Splunk Config Files Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Fields / Calculated Fields Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Fields / Field Extractions Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Fields / Field Aliases Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Fields / Field Transformations Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Source Types Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Event Types Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Lookups / Lookup Table Files Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Lookups / Lookup Definitions Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Lookups / Automatic Lookups Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Macros Gen Job
    GMC Jobs / GMC Gen Jobs / SH Tier Gen Jobs / Data Models Gen Job

If you run a dashboard and find no data, please run the corresponding Job(s) assicoated with the dashboard from the GMC Jobs dropdown otherwise all jobs will execute between 12AM and 6AM every day. The above are needed to get you started right now.

Accelerate the Splunk Global Monitoring Console (GMC) Data Model with at least 7 days. Set the Summary Range to at least 7 days, recommended 3-month so we don't lose important search statistics from the internal indexes.

Adjust the following Macros:

    es_search_head
        Adjust to the Enterprise Security Search Head Splunk Instance Name, you can find it in the GMC Assets Dashboard.
    gmc_dm_constraints
        Change the default which is search_group=dmc_group_search_head to accelerate the GMC Data Model against a smaller subset of your Search Heads.
    license_master
        Adjust to the License Master Splunk Instance Name, you can find it in the GMC Assets Dashboard.
    set_geo_defaults
        Adjust the eval statements with your custom Identities Geo Defaults you like every user to get when we don't have this information on them. Set the defaults for City, State/Region & Country
    set_identities_custom
        Adjust the eval statements with your custom Identities defaults you like every user to get when we don't have this information on them.
    gmc_summary_index
        Adjust the eval statements with your custom summary index otherwise GMC will default to the summary index
    geostats_field
        Adjust the eval statements with your custom group by in the Users Activity Dashboard Geo Map, the default is full name

Tracking KV Stores Load Procedure

If you like to fill-up the 3 KV Stores for Users, Dashboards & Report/Alerts please click on each one of these Jobs, select All Time from the time range selector and run the job, this will automatically fill the KV Stores with all the data you have so far. Please do not save the Job, close the window when done and going forward these 3 jobs run every 5 minutes and tracks by looking at a very small amount of data to keep the KV Store updated.

    GMC Jobs / GMC Tracking Jobs / Track Users Activity (every 5 minutes)
    GMC Jobs / GMC Tracking Jobs / Track Dashboards Execution (every 5 minutes)
    GMC Jobs / GMC Tracking Jobs / Reports / Track Reports/Alerts Execution (every 5 minutes)

Tracking Index Size License Usage Summary Index Load Procedure

If you like to fill-up the summary index with Index Size License Usage click on the link below and select All Time from the time range selector and run the job, this will automatically fill the summary index with data for the first time and going forward these jobs will execute on daily basis to keep the summary index up-to-date

    GMC Jobs / GMC Tracking Jobs / Track License Usage By Cluster By Index Daily
    GMC Jobs / GMC Tracking Jobs / Track License Usage By Cluster Daily
    GMC Jobs / GMC Tracking Jobs / Track Index Size Daily
    GMC Jobs / GMC Tracking Jobs / Track Index Volume Size Daily
    GMC Jobs / GMC Tracking Jobs / Track Forwarder Ingestion Stats Daily
